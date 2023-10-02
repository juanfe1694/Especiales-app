
export const useDateTimeFormater = () => {

  const dateFormat: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
    
    const convertTo12HourFormat = (timeString: string): string => {
        const date = new Date(timeString);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        
        const amPm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        
        return `${formattedHours}:${formattedMinutes} ${amPm}`;
      };

      const getRemainingTime = (date: Date) => {
        const currentDate = new Date();
        const endDate = new Date(date);
    
        const miliseconds = endDate.getTime() - currentDate.getTime();
        const seconds = Math.floor(miliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const countHours = Math.floor(minutes / 60);
        const countDays = Math.floor(countHours / 24);
    
        const months =
          Math.floor(countDays / 30) > 0 ? Math.floor(countDays / 30) : 0;
        const days = countDays % 30 > 0 ? countDays % 30 : 0;
        const hours = countHours % 24 > 0 ? countHours % 24 : 0;
    
        return({ months, days, hours });
      };

      const getFormatedDate = (date: Date) => {
        const newDate = new Date(date)
        return newDate.toLocaleDateString('es-ES', dateFormat)
      }

      const getFormatedTime = (time: Date) => {
        const convertedTime = convertTo12HourFormat(time.toString());
        return convertedTime;
      }

  return { convertTo12HourFormat, getRemainingTime, getFormatedDate, getFormatedTime }
}
