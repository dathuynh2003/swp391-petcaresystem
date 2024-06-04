import React, { useState } from 'react';

function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Khai báo các trường dữ liệu của form
    // Ví dụ:
    name: '',
    email: '',
    // Thêm các trường dữ liệu khác cần thiết
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý dữ liệu form ở bước cuối cùng
    console.log(formData);
    // Điều hướng hoặc xử lý các thao tác tiếp theo ở đây
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  switch (step) {
    case 1:
      return (
        <form onSubmit={nextStep}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tên"
          />
          {/* Thêm các trường dữ liệu khác của bước 1 */}
          <button type="submit">Tiếp theo</button>
        </form>
      );
    case 2:
      return (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          {/* Thêm các trường dữ liệu khác của bước 2 */}
          <button type="button" onClick={prevStep}>Quay lại</button>
          <button type="submit">Hoàn thành</button>
        </form>
      );
    // Thêm các case khác cho các bước tiếp theo nếu cần
    default:
      return null;
  }
}

export default MultiStepForm;
