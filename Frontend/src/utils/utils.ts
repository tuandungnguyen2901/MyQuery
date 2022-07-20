import moment from "moment";

export const formatDate = (timestamp: any) => {
  return moment(timestamp).format("h:mm A");
};


const validateEmail = (v: string) => {
  if (!v) {
    return false;
  }
  let emailPattern = "[a-zA-Z0-9_\\.\\+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-\\.]+";

  return v.match(emailPattern);
};

const validatePhoneNumber = (v: string) => {
  if (!v) {
    return false;
  }
  let phonePattern = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;

  return v.match(phonePattern);
};

const calculateDate = (v: any) => {
  const diffInSec = moment().diff(moment(v), 'second');

  if (diffInSec < 60) {
    return `${diffInSec} seconds`;
  }

  const diffInMin = moment().diff(moment(v), 'minute');
  if (diffInMin < 60) {
    return `${diffInMin} minutes`;
  }

  const diffInHour = moment().diff(moment(v), 'hour');
  if (diffInHour < 24) {
    return `${diffInHour} hours`;
  }

  return moment(v).format('MMM, Do YY');
};

const sortByDate = (arr: any, type: string) => {
  const compare = (a: any, b: any) => {
    const date1 = moment(a.created_at);
    const date2 = moment(b.created_at);

    if (type === 'newest') {
      if (date1.diff(date2) > 0) {
        return -1;
      }
      if (date1.diff(date2) < 0) {
        return 1;
      }

      return 0;
    }

    if (type === 'oldest') {
      if (date1.diff(date2) > 0) {
        return 1;
      }
      if (date1.diff(date2) < 0) {
        return -1;
      }

      return 0;
    }
  };

  const sortedArr = arr.sort(compare);

  return sortedArr;
};

const sortByVote = (arr: any, type: string) => {
  const compare = (a: any, b: any) => {
    const vote1 = a.upvote_list?.length - a.downvote_list?.length;
    const vote2 = b.upvote_list?.length - b.downvote_list?.length;

    if (type === 'des') {
      if (vote1 - vote2 > 0) {
        return -1;
      }

      if (vote1 - vote2 < 0) {
        return 1;
      }

      return 0;
    }

    if (type === 'asc') {
      if (vote1 - vote2 > 0) {
        return 1;
      }

      if (vote1 - vote2 < 0) {
        return -1;
      }

      return 0;
    }
  };

  const sortedArr = arr.sort(compare);
  return sortedArr;
};

const getUserIdFromLocalStorage = () => {
  return localStorage.getItem('userId');
};

const hasSubArray = (master: any, sub: any) => {
  //loop qua sub
  console.log(master, sub);
  sub.forEach((element: any) => {
    if (master.includes(element) === false) {
      return false;
    }
  });
  return true;
};

export {
  validateEmail,
  validatePhoneNumber,
  calculateDate,
  sortByDate,
  sortByVote,
  getUserIdFromLocalStorage,
  hasSubArray,
};
