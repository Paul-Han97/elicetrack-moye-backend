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
         ,B.email email
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
        AND (B.name LIKE ?
         OR B.name LIKE ?)`,

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
        AND (B.phone LIKE ?
         OR B.phone LIKE ?)`,
};

export const storeQuery = {
  findAll:
  `WITH selected_store AS (
      SELECT A.id
        FROM store A
      WHERE A.id BETWEEN ? AND ?
   )
   SELECT A.id id
         ,A.name name
         ,A.contact contact
         ,A.seat_count seatCount
         ,A.table_count tableCount
         ,B.weekendOpeningTime weekendOpeningTime
         ,B.weekendCloseingTime weekendCloseingTime
         ,B.weekendStartBreakTime weekendStartBreakTime
         ,B.weekendEndBreakTime weekendEndBreakTime
         ,C.weekdayOpeningTime weekdayOpeningTime
         ,C.weekdayCloseingTime weekdayCloseingTime
         ,C.weekdayStartBreakTime weekdayStartBreakTime
         ,C.weekdayEndBreakTime weekdayEndBreakTime
     FROM store A
         ,(SELECT XA.id id
                 ,MIN(XD.open_from) weekendOpeningTime
                 ,MAX(XD.close_to) weekendCloseingTime
                 ,MIN(XD.close_to) weekendStartBreakTime
                 ,MAX(XD.open_from) weekendEndBreakTime
             FROM store XA
             INNER JOIN store_default_opening_hour XB ON XB.store_id = XA.id 
             INNER JOIN day XC ON XC.id = XB.day_id
             INNER JOIN opening_hour XD ON XD.store_default_opening_hour_id = XB.id
             INNER JOIN selected_store XE ON XE.id = XA.id
             WHERE XC.id IN (1, 7)
           GROUP BY XA.id) B
         ,(SELECT XA.id id 
                 ,MIN(XD.open_from) weekdayOpeningTime
                 ,MAX(XD.close_to) weekdayCloseingTime
                 ,MIN(XD.close_to) weekdayStartBreakTime
                 ,MAX(XD.open_from) weekdayEndBreakTime
             FROM store XA
             INNER JOIN store_default_opening_hour XB ON XB.store_id = XA.id 
             INNER JOIN day XC ON XC.id = XB.day_id
             INNER JOIN opening_hour XD ON XD.store_default_opening_hour_id = XB.id
             INNER JOIN selected_store XE ON XE.id = XA.id
           WHERE XC.id BETWEEN 2 AND 6
           GROUP BY XA.id) C
    WHERE A.id = B.id
      AND B.id = C.id`,

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
  `SELECT '주말' type
 			   ,MIN(D.open_from) openFrom
 			   ,MAX(D.close_to) closeTo
         ,MIN(D.close_to) startBreakTime
         ,MAX(D.open_from) endBreakTime
     FROM store A
     INNER JOIN store_default_opening_hour B ON B.store_id = A.id 
     INNER JOIN day C ON C.id = B.day_id
     INNER JOIN opening_hour D ON D.store_default_opening_hour_id = B.id
    WHERE A.id = ?
      AND C.id IN (1, 7)
  UNION ALL
  SELECT '평일' type
        ,MIN(D.open_from) openFrom
        ,MAX(D.close_to) closeTo
        ,MIN(D.close_to) startBreakTime
        ,MAX(D.open_from) endBreakTime
    FROM store A
    INNER JOIN store_default_opening_hour B ON B.store_id = A.id 
    INNER JOIN day C ON C.id = B.day_id
    INNER JOIN opening_hour D ON D.store_default_opening_hour_id = B.id
   WHERE A.id = ?
     AND C.id BETWEEN 2 AND 6`,

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

  findByIdWithEmail:
    `SELECT A.id
           ,A.business_registration_number businessRegistrationNumber
           ,A.business_name businessName
           ,A.name name
           ,A.address address
           ,A.contact contact
           ,A.seat_count totalSeats
           ,A.table_count numberPerTable
           ,A.description description
           ,B.email email
       FROM store A
       INNER JOIN user B ON A.user_id = B.id
      WHERE A.id = ?`,
  
  findFormattedImageById:
    `SELECT IF(B.is_primary = TRUE, 'TRUE', 'FALSE') isPrimary
	         ,C.url url
       FROM store A
       INNER JOIN image_store B ON A.id = B.store_id 
       INNER JOIN image C ON B.image_id = C.id 
      WHERE A.id = ?`,
  
  findImageById:
    `SELECT C.id id
           ,C.url url
       FROM store A
       INNER JOIN image_store B ON A.id = B.store_id 
       INNER JOIN image C ON B.image_id = C.id 
      WHERE A.id = ?`,
}

export const userQuery = {
  findImageById:
    `SELECT C.id id
           ,C.url url
       FROM user A
       INNER JOIN image_user B ON A.id = B.user_id 
       INNER JOIN image C ON B.image_id = C.id 
      WHERE A.id = ?`
}