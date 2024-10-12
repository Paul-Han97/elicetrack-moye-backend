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
  `SELECT B.name name
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
   ORDER BY A.start_time`
};

