export const reservationQuery = {
  findByStoreIdGroupByDate: `SELECT DATE_FORMAT(A.start_time, '%Y-%m-%d') ymd
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
};
