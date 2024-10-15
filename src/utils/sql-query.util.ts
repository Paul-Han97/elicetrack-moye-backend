import { PAGINATION_LIMIT } from "../constants";

export const reservationQuery = {
  findMonthlyReservationByStoreId:
  `SELECT DATE_FORMAT(A.start_time, '%Y-%m-%d') ymd
         ,B.type type 
         ,COUNT(reservation_state_id) count
     FROM reservation A
     INNER JOIN reservation_state B ON A.reservation_state_id = B.id 
    WHERE A.store_id = ?
      AND MONTH(A.start_time) = ?
   GROUP BY ymd
           ,A.reservation_state_id
   ORDER BY ymd
           ,A.reservation_state_id`,

  findTodayReservationByStoreId: 
  `SELECT A.id
         ,B.name name
         ,A.count count
         ,DATE_FORMAT(A.start_time, '%H:%i') startTime
         ,DATE_FORMAT(A.end_time, '%H:%i') endTime
         ,B.phone phone
         ,C.TYPE status
     FROM reservation A
     INNER JOIN user B ON A.user_id = B.id
     INNER JOIN reservation_state C ON A.reservation_state_id = C.id
    WHERE A.store_id = ?
      AND DATE(A.start_time) = DATE(NOW())
   ORDER BY A.start_time`,
  
   findAllUser:
   `SELECT A.id reservationId
          ,C.type status
          ,B.name name
          ,B.phone phone
          ,A.count count
          ,DATE_FORMAT(A.start_time, '%Y-%m-%d|%w') ymd
          ,DATE_FORMAT(A.start_time, '%H:%i') startTime
          ,DATE_FORMAT(A.end_time, '%H:%i') endTime
      FROM reservation A
      INNER JOIN user B ON A.user_id = B.id
      INNER JOIN reservation_state C ON A.reservation_state_id = C.id
     WHERE A.store_id = ?
    ORDER BY A.start_time
    LIMIT ?, ${PAGINATION_LIMIT}`,

    findUserByName:
    `SELECT A.id resrvationId
           ,C.type status  
           ,B.name name
           ,B.phone phone
           ,A.count count
           ,DATE_FORMAT(A.start_time, '%Y-%m-%d|%w') ymd
           ,DATE_FORMAT(A.start_time, '%H:%i') startTime
           ,DATE_FORMAT(A.end_time, '%H:%i') endTime
       FROM reservation A
       INNER JOIN user B ON A.user_id = B.id
       INNER JOIN reservation_state C ON A.reservation_state_id = C.id
      WHERE A.store_id = ?
        AND B.name LIKE ?`,

    findUserByPhone:
    `SELECT A.id resrvationId
           ,C.type status  
           ,B.name name
           ,B.phone phone
           ,A.count count
           ,DATE_FORMAT(A.start_time, '%Y-%m-%d|%w') ymd
           ,DATE_FORMAT(A.start_time, '%H:%i') startTime
           ,DATE_FORMAT(A.end_time, '%H:%i') endTime
       FROM reservation A
       INNER JOIN user B ON A.user_id = B.id
       INNER JOIN reservation_state C ON A.reservation_state_id = C.id
      WHERE A.store_id = ?
        AND B.phone LIKE ?`,
};

export const storeQuery = {
  findTodayOpeningHourById:
  `SELECT MIN(C.open_from) open
         ,MAX(C.close_to) close
     FROM store A
     INNER JOIN store_default_opening_hour B ON A.id = B.store_id 
     INNER JOIN opening_hour C ON B.id  = C.store_default_opening_hour_id
     INNER JOIN day D ON B.day_id = D.id
    WHERE A.id = ?
      AND D.id = DAYOFWEEK(NOW())`,

  findOpeningHourById:
  `SELECT IF(C.id = 1, '평일', '주말') type
         ,MIN(D.open_from) openFrom
         ,MAX(D.close_to) closeTo
         ,MIN(D.close_to) startBreakTime
         ,MAX(D.open_from) endBreakTime
     FROM store A
     INNER JOIN store_default_opening_hour B ON B.store_id = A.id 
     INNER JOIN day C ON B.day_id = C.id
     INNER JOIN opening_hour D ON B.id = D.store_default_opening_hour_id
    WHERE A.id = ?
      AND D.open_from IS NOT NULL
      AND C.id IN (1, 2)
   GROUP BY C.id`,

   findClosedDayById:
   `SELECT DATE_FORMAT(B.close_to, '%Y-%m-%d') ymd
      FROM store A
     INNER JOIN store_opening_hour_override B ON A.id  = B.store_id
     WHERE A.id = ?
       AND B.is_closed = TRUE`,
       
  findRegularHolidayById:
    `SELECT C.id closedDay
      FROM store A
      INNER JOIN store_default_opening_hour B ON B.store_id = A.id 
      INNER JOIN day C ON B.day_id = C.id
      INNER JOIN opening_hour D ON B.id = D.store_default_opening_hour_id
      WHERE A.id = ?
        AND D.open_from IS NULL`,

  findById:
    `SELECT A.business_registration_number businessRegistrationNumber
           ,A.business_name businessName
           ,A.contact contact
           ,A.seat_count totalSeats
           ,A.table_count numberPerTable
           ,A.description description
           ,B.email email
       FROM store A
       INNER JOIN user B ON A.user_id = B.id
      WHERE A.id = ?`,
  
  findImageById:
    `SELECT IF(B.is_primary = TRUE, 'TRUE', 'FALSE') isPrimary
	         ,C.url url
       FROM store A
       INNER JOIN image_store B ON A.id = B.store_id 
       INNER JOIN image C ON B.image_id = C.id 
      WHERE A.id = ?`
}