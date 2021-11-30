export function since(d: Date) {
  const now = new Date();

  let out;

  const current = {
    day: now.getDate(),
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    hours: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds()
  }

  const date = {
    day: d.getDate(),
    month: d.getMonth() + 1,
    year: d.getFullYear(),
    hours: d.getHours(),
    minutes: d.getMinutes(),
    seconds: d.getSeconds()
  }

  if (current.year === date.year) {
    if (current.month === date.month) {
      if (current.day === date.day) {
        const passed = (current.hours * 3600 + current.minutes * 60 + current.seconds) - (date.hours * 3600 + date.minutes * 60 + date.seconds);

        if (passed < 60) {
          out = 'now';
        } else if (passed < 120) {
          out = '1 minute ago';
        } else if (passed < 3600) {
          out = ((current.minutes + current.hours * 60) - (date.minutes + date.hours * 60)) + ' minutes ago';
        } else {
          out = (current.hours - date.hours) + ((current.hours - date.hours) === 1 ? ' hour ago' : ' hours ago');
        }
      } else if (current.day === date.day + 1) {
        out = 'yesterday';
      } else {
        out = (current.day - date.day) + ' days ago';
      }
    } else if (current.month === date.month + 1) {
      if (current.day === 1) {
        out = 'yesterday';
      } else if ((current.month * 30 + current.day) - (date.month * 30 + date.day) < 30) {
        out = ((current.month * 30 + current.day) - (date.month * 30 + date.day)) + ' days ago';
      } else {
        out = 'last month';
      }
    } else {
      out = (current.month - date.month) + ' months ago';
    }
  } else if (current.year === date.year + 1) {
    out = 'last year';
  } else {
    out = (current.year - date.year) + ' years ago';
  }

  return out;
}

export function renderTime(d: Date) {
  const hours = d.getHours().toString();
  const minutes = d.getMinutes().toString();
  const seconds = d.getSeconds().toString();

  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
}