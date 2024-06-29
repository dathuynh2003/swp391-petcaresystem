package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.Shift;
import com.swpproject.pethealthcaresystem.model.VetShiftDetail;
import com.swpproject.pethealthcaresystem.repository.ShiftRepository;
import com.swpproject.pethealthcaresystem.repository.VetShiftDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ShiftService implements IShiftService {

    @Autowired
    private ShiftRepository shiftRepository;

    @Autowired
    private VetShiftDetailRepository vetShiftDetailRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Shift> getAllShifts() {
        List<Shift> shifts = shiftRepository.findAll();
        for (Shift shift : shifts) {
            Set<VetShiftDetail> vetShiftDetails = shift.getVetShiftDetails();
            if (vetShiftDetails != null)
                for (VetShiftDetail vetShiftDetail : vetShiftDetails) {
                    vetShiftDetail.setBookings(null);
                }
        }
        return shifts;
    }

    @Override
    @Transactional
    public Shift createShift(Shift shift) {
        return shiftRepository.save(shift);
    }

    @Override
    @Transactional
    public void deleteShift(int shiftId) {
        shiftRepository.deleteById(shiftId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VetShiftDetail> getAllShiftDetails() {
        List<VetShiftDetail> vetShiftDetails = vetShiftDetailRepository.findAll();
        for (VetShiftDetail vetShiftDetail : vetShiftDetails) {
            vetShiftDetail.setBookings(null);
        }
        return vetShiftDetails;
    }

    @Override
    @Transactional
    public List<VetShiftDetail> assignVetToShifts(List<VetShiftDetail> vetShiftDetails) {
        return vetShiftDetailRepository.saveAll(vetShiftDetails);
    }

    @Override
    public List<VetShiftDetail> getAllVetShiftsByUser(int vetId) {
        return vetShiftDetailRepository.findAll().stream()
                .filter(vetShiftDetail -> vetShiftDetail.getUser() != null && vetShiftDetail.getUser().getUserId() == vetId)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isShiftAssignedToVet(int shiftId, int vetId, String date) {
        return vetShiftDetailRepository.existsByShiftShiftIdAndUserUserIdAndDate(shiftId, vetId, date);
    }

    @Override
    public boolean deleteVetShiftDetail(Long shiftId, Long vetId, String date) {
        Optional<VetShiftDetail> vetShiftDetailOpt = vetShiftDetailRepository.findByShiftShiftIdAndUserUserIdAndDate(shiftId, vetId, date);
        if (vetShiftDetailOpt.isPresent()) {
            vetShiftDetailRepository.delete(vetShiftDetailOpt.get());
            return true;
        }
        return false;
    }

    @Override

    public List<VetShiftDetail> getAvailableVetShiftDetails() {
        LocalTime currentPlusSixHours = LocalTime.now().plusHours(6);
        return vetShiftDetailRepository.findAll().stream()
                .filter(v -> {
                    // Lấy shift từ VetShiftDetail
                    Shift shift = v.getShift();
                    // Kiểm tra nếu shift không phải null và from_time không rỗng
                    if (shift != null && shift.getFrom_time() != null) {
                        // Chuyển đổi from_time từ chuỗi sang LocalTime
                        LocalTime fromTime = LocalTime.parse(shift.getFrom_time());
                        // Kiểm tra nếu from_time lớn hơn thời gian hiện tại cộng thêm 6 giờ
                        return fromTime.isAfter(currentPlusSixHours);
                    }
                    return false; // Trong trường hợp shift là null hoặc from_time là null
                })
                .collect(Collectors.toList());

    }

    @Override
    public List<VetShiftDetail> getShiftByDate(String date) {
        return vetShiftDetailRepository.findAll().stream().filter(shift -> shift.getDate().equals(date))
                .collect(Collectors.toList());
//        return vetShiftDetailRepository.findAll();
    }
}
