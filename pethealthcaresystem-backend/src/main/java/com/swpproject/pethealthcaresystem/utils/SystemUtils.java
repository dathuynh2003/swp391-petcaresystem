package com.swpproject.pethealthcaresystem.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class SystemUtils {
    private static final SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd");

    public static Date parseStringToDate(String dateString) {
        try {
            return dateFormatter.parse(dateString);
        } catch (ParseException e) {
            // Handle parsing exception as per your requirement
            e.printStackTrace();
            return null; // Or throw an exception or handle it according to your application's logic
        }
    }
    public static Date endOfDay(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MILLISECOND, 999);
        return calendar.getTime();
    }
}
