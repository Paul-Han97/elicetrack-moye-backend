import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export function getTime(time: string) {
  return dayjs(time, 'HH:mm').toDate();
}

export function getYmd(date: string) {
  return dayjs(date).toDate();
}