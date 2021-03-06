import numeral from "numeral";
import Vue from "vue";
import { DATETIME_FULL_TEXT, DATE_BIRTHDAY, DATETIME_HH_MM_DD_MM_YY_DASH, DATETIME_FULL_DATE_TEXT } from "~/utils/config";
import { EXERCISE_CATEGORIES, EXERCISE_STATUS, EXERCISE_TYPES, SUBMISSION_RESULTS, TRANSACTION_STATUSES, WITHDRAWAL_STATUSES, ELEARNING_TYPES, EXAM_TYPES, EXAM_LEVEL, EXAM_TYPE_QUESTION } from "~/utils/constants";
// const moment = require("moment");
import { getLocalDateTime } from '~/utils/moment';

/**
 * 10000 => "10.000"
 * @param {number} num
 * @param {string} separator
 */
export function toThousandFilter(num, separator = ".") {
  // console.log("[toThousandFilter]", num)
  return (+num || 0)
    .toString()
    .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, separator));
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string = '') {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * 10000 => 10,000, 10.000
 * @param {Number} num
 * @param {String} format
 */
export function numeralFormat(num, format = "0,0") {
  return numeral(num).format(format);
}

/**
 * Filesize Filter
 * @Param {number} size
 * @return string
 */
export function fileSizeFilter(size) {
  if (isNaN(size)) size = 0;

  if (size < 1024) return size + " Bytes";

  size /= 1024;

  if (size < 1024) return size.toFixed(2) + " KB";

  size /= 1024;

  if (size < 1024) return size.toFixed(2) + " MB";

  size /= 1024;

  if (size < 1024) return size.toFixed(2) + " GB";

  size /= 1024;

  return size.toFixed(2) + " TB";
}

/**
 * Truncate a string Filter
 * @Param {string} str
 * @Param {integer} charCounter
 * @Param {boolean} useWordBoundary
 * @return string
 */
export function truncStrFilter(
  str = "",
  charCounter = 0,
  useWordBoundary = false
) {
  if (str.length <= charCounter) {
    return str;
  }
  var subString = str.substr(0, charCounter - 1);
  return (
    (useWordBoundary
      ? subString.substr(0, subString.lastIndexOf(" "))
      : subString) + " ..."
  );
}

/**
 * Parse the result percentage
 *
 */
export function resultFigureRate(val, type) {
  const data = [
    { type: 'passed_percent', figure: val['passed_percent'] || 0 },
    { type: 'failed_percent', figure: val['failed_percent'] || 0 },
    { type: 'pending_percent', figure: val['pending_percent'] || 0 },
  ]
  const sorted = data.sort((first, second) => {
    return first.figure > second.figure
  })
  let parsedData = {}
  let total = 0
  for (let i = 0; i < 3; i++) {
    let tmp = sorted[i]
    const figure = tmp.figure
    let current = 0
    if (figure == 0 || figure == 0.0) {
      current = 0
      parsedData[tmp.type] = current
    } else if (figure == 100 || figure == 100.0) {
      current = 100
      parsedData[tmp.type] = current
    } else if (figure > 0 && figure <= 1) {
      current = 1
      parsedData[tmp.type] = current
    } else {
      if (i != 2) {
        current = parseInt(figure)
        parsedData[tmp.type] = current
      } else {
        parsedData[tmp.type] = 100 - total
        break
      }
    }
    total += current
  }
  return parsedData[type]
}

/**
 * Translate exercise category => label
 * @Param {string} str
 */
export function exCate2Txt(str = "") {
  const MATCHED_DATA = {
    [EXERCISE_CATEGORIES.EXERCISE]: "B??i t???p",
    [EXERCISE_CATEGORIES.TEST]: "B??i ki???m tra"
  };
  if (MATCHED_DATA.hasOwnProperty(str)) return MATCHED_DATA[str];
  return "Lo???i kh??c";
}

/**
 * Translate exercise type => label
 * @Param {string} str
 */
export function exType2Txt(str = "") {
  const strUpperCase = str.toLocaleUpperCase();
  const MATCHED_DATA = {
    [EXERCISE_TYPES.CHOICE]: "Tr???c nghi???m",
    [EXERCISE_TYPES.ESSAY]: "T??? lu???n",
    [EXERCISE_TYPES.MIX]: "H???n h???p"
  };
  if (MATCHED_DATA.hasOwnProperty(strUpperCase)) return MATCHED_DATA[strUpperCase];
  return "-";
}

export function exPublishStatus2Txt(str = "") {
  const strUpperCase = str.toLocaleUpperCase();
  const MATCHED_DATA = {
    PUBLISHED: "???? xu???t b???n",
    COMPLETED: "Ho??n th??nh",
   PENDING: "Ch??a ho??n th??nh"
  };
  if (MATCHED_DATA.hasOwnProperty(strUpperCase)) return MATCHED_DATA[strUpperCase];
  return "-";
}

export function exType2TxtExam(str = "") {
  const strUpperCase = str.toLocaleUpperCase();
  const MATCHED_DATA = {
    [EXAM_TYPES.CHOICE]: "Tr???c nghi???m",
    [EXAM_TYPES.ESSAY]: "T??? lu???n",
    [EXAM_TYPES.MIX]: "H???n h???p"
  };
  if (MATCHED_DATA.hasOwnProperty(strUpperCase)) return MATCHED_DATA[strUpperCase];
  return "-";
}

export function exType2TxtLevel(str = "") {
  const strUpperCase = str.toLocaleUpperCase();
  const MATCHED_DATA = {
    [EXAM_LEVEL.EASY]: "D???",
    [EXAM_LEVEL.MEDIUM]: "Trung b??nh",
    [EXAM_LEVEL.HARD]: "Kh??",
    [EXAM_LEVEL.BY_FILE]: "Theo file"
  };
  if (MATCHED_DATA.hasOwnProperty(strUpperCase)) return MATCHED_DATA[strUpperCase];
  return "-";
}

export function exType2TxtTypeQues(str = "") {
  const MATCHED_DATA = {
    [EXAM_TYPE_QUESTION.ESSAY]: "T??? lu???n",
    [EXAM_TYPE_QUESTION.SINGLE_CHOICE]: "M???t l???a ch???n",
    [EXAM_TYPE_QUESTION.WORD_CHOICE]: "Ch???n t???",
    [EXAM_TYPE_QUESTION.WORD_MATCH]: "Gh??p ????p ??n",
    [EXAM_TYPE_QUESTION.YES_NO]: "????ng/Sai",
    [EXAM_TYPE_QUESTION.FILL_IN_BLANK]: "??i???n t???",
    [EXAM_TYPE_QUESTION.MULTIPLE_CHOICE]: "Nhi???u l???a ch???n",
    [EXAM_TYPE_QUESTION.BY_FILE]: "Theo file"
  };
  if (MATCHED_DATA.hasOwnProperty(str)) return MATCHED_DATA[str];
  return "-";
}

/**
 * Translate submission results => status
 * @Param {string} str
 */
export function subResult2Txt(str = "") {
  const MATCHED_DATA = {
    [SUBMISSION_RESULTS.PASSED]: "?????t",
    [SUBMISSION_RESULTS.FAILED]: "Kh??ng ?????t",
    [SUBMISSION_RESULTS.PENDING]: "Ch??a ch???m",
    [SUBMISSION_RESULTS.NONE]: "Ch??a l??m"
  };
  if (MATCHED_DATA.hasOwnProperty(str)) return MATCHED_DATA[str];
  return "-";
}

/**
 * Translate withdrawal status => text
 * @Param {string} str
 */
export function withdrawalStatus2Txt(str = "") {
  const MATCHED_DATA = {
    [WITHDRAWAL_STATUSES.SUCCESS]: "Th??nh c??ng",
    [WITHDRAWAL_STATUSES.FAILED]: "Th???t b???i",
    [WITHDRAWAL_STATUSES.PENDING]: "Ch??? duy???t"
  };
  if (MATCHED_DATA.hasOwnProperty(str)) return MATCHED_DATA[str];
  return "-";
}

/**
 * Translate transaction status => text
 * @Param {string} str
 */
export function transactionStatus2Txt(str = "") {
  const MATCHED_DATA = {
    [TRANSACTION_STATUSES.SUCCESS]: "Th??nh c??ng",
    [TRANSACTION_STATUSES.FAILED]: "Th???t b???i",
    [TRANSACTION_STATUSES.PENDING]: "TTL???i", // can repay if status == pending
    [TRANSACTION_STATUSES.CANCEL]: "Hu???", // can repay if status == pending
    [TRANSACTION_STATUSES.CANCEL_SUCCESS]: "???? Hu???" // can repay if status == pending
  };
  if (MATCHED_DATA.hasOwnProperty(str)) return MATCHED_DATA[str];
  return "-";
}

export function convertBreadcrumText(str = "", elearningInfo) {
  let breadcrumTxt = str;
  switch (str) {
    case "Elearning":
      breadcrumTxt = "E-learning";
      break;
    case "manager":
      breadcrumTxt = "Qu???n l?? E-learning";
      break;
    case "":
      breadcrumTxt = "T???ng Quan";
      break;
    case "courses":
      breadcrumTxt = "B??i gi???ng v?? kho?? h???c";
      break;
    case "exams":
      breadcrumTxt = "B??i t???p v?? b??i ki???m tra";
      break;
    case "warehouses":
      breadcrumTxt = "Kho h???c li???u";
      break;
    case "online-class":
      breadcrumTxt = "Ph??ng h???c online";
      break;
    case "interacts":
      breadcrumTxt = "T????ng t??c v???i h???c sinh";
      break;
    case "rates":
      breadcrumTxt = "????nh gi?? v?? b??nh lu???n";
      break;
    case "list":
      breadcrumTxt = "Danh s??ch";
      break;
    case "participants":
      breadcrumTxt = "H???c sinh tham gia";
      break;
    case "students":
      breadcrumTxt = "Danh sa??ch ho??c sinh";
      break;
    default:
      // const lectureType = elearningInfo.type == ELEARNING_TYPES.COURSE ? 'Kho?? h???c' : 'B??i gi???ng';
      breadcrumTxt = `${elearningInfo.subject.name}`;
      break;
  }
  // console.log("convertBreadcrumText", elearningInfo, breadcrumTxt);
  return breadcrumTxt;
}


export function getExerciseTypeText(type = "") {
  if (type === EXERCISE_TYPES.CHOICE) {
    return "B??i t???p tr???c nghi???m";
  } else if (type === EXERCISE_TYPES.ESSAY) {
    return "B??i t???p t??? lu???n";
  } else if (type === EXERCISE_TYPES.MIX) {
    return "B??i t???p h???n h???p";
  }
  return '-'
}

export function getTestTypeText(type = "") {
  if (type === EXERCISE_TYPES.CHOICE) {
    return "B??i ki???m tra tr???c nghi???m";
  } else if (type === EXERCISE_TYPES.ESSAY) {
    return "B??i ki???m tra t??? lu???n";
  }
}

export function getCommonTestTypeText(type = "") {
  if (type === EXERCISE_TYPES.CHOICE) {
    return "Tr???c nghi???m";
  } else if (type === EXERCISE_TYPES.ESSAY) {
    return "T??? lu???n";
  } else if (type === EXERCISE_TYPES.MIX) {
    return "H???n h???p";
  }
  return '-'
}


export function getElearningTypeText(type = "") {
  if (type === ELEARNING_TYPES.COURSE) {
    return "Kh??a h???c";
  } else if (type === ELEARNING_TYPES.LECTURE) {
    return "B??i gi???ng";
  }
}

export function getQuestionNoText(_index = "") {
  let noText = '';
  switch (_index) {
    case 1:
      noText = 'A';
      break;
    case 2:
      noText = 'B';
      break;
    case 3:
      noText = 'C';
      break;
    case 4:
      noText = 'D';
      break;
    case 5:
      noText = 'E';
      break;
    case 6:
      noText = 'F';
      break;
    case 7:
      noText = 'G';
      break;
    case 8:
      noText = 'H';
      break;

    default:
      break;
  }

  return noText;
}


export function getExerciseResultText(result = "") {
  let resultText = '';
  switch (result) {
    case EXERCISE_STATUS.FAILED:
      resultText = 'Ch??a ?????t';
      break;
    case EXERCISE_STATUS.NONE:
      resultText = 'Ch??a ?????t';
      break;
    case EXERCISE_STATUS.PASSED:
      resultText = '?????t';
      break;
    case EXERCISE_STATUS.PENDING:
      resultText = 'Ch??? ch???m ??i???m';
      break;


    default:
      break;
  }

  return resultText;
}

export function getDateTimeFullText(_utcDate = "") {
  if (!_utcDate) return;
  // const ts = moment.utc(_utcDate);
  const ts = getLocalDateTime(_utcDate);
  return ts.format(DATETIME_FULL_DATE_TEXT);
}

export function getDateBirthday(_utcDate = "") {
  if (!_utcDate) return;
  // const ts = moment.utc(_utcDate);
  const ts = getLocalDateTime(_utcDate);
  return ts.format(DATE_BIRTHDAY);
}

export function getDateTimeHhMmDdMmYyDash(_utcDate = "") {
  if (!_utcDate) return;
  // const ts = moment.utc(_utcDate);
  const ts = getLocalDateTime(_utcDate);
  return ts.format(DATETIME_HH_MM_DD_MM_YY_DASH);
}

/**
 * convert seconds to text: hh gi??? mm ph??t
 */
export function formatHour(val = 0) {
  if (!val) return "--";
  const h = Math.floor(val / 60 / 60);
  const m = Math.floor((val - 60 * 60 * h) / 60);
  // const s = val - 60 * 60 * h - 60 * m;

  let strTime = h + " gi??? " + m + " ph??t";
  return strTime;
}

/**
 * convert seconds to text:  mm ph??t ss gi??y
 */
export function formatMMSS(val = 0) {
  const m = Math.floor(val / 60);
  const s = val - 60 * m;

  let strTime = m + " ph??t " + s + " gi??y";
  return strTime;
}

export function capitalizeFirstLetter(s = "") {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function capitalizeFirstLetterOfString(s = "") {
  // console.log("[capitalizeFirstLetterOfString]", s);
  const arr = s.split(" ");
  const [first, second, ...third] = arr;
  return [first, capitalizeFirstLetter(second), third.join(" ")].join(" ");
}

export function getTypeQuestion(_index = "") {
  let type = 1;
  switch (_index) {
    case EXAM_TYPE_QUESTION.YES_NO:
      type = 1;
      break;
    case EXAM_TYPE_QUESTION.SINGLE_CHOICE:
      type = 2;
      break;
    case EXAM_TYPE_QUESTION.MULTIPLE_CHOICE:
      type = 3;
      break;
    case EXAM_TYPE_QUESTION.FILL_IN_BLANK:
      type = 5;
      break;
    case EXAM_TYPE_QUESTION.WORD_CHOICE:
      type = 6;
      break;
    case EXAM_TYPE_QUESTION.WORD_MATCH:
      type = 4;
      break;
    case EXAM_TYPE_QUESTION.ESSAY:
      type = 7;
      break;
    default:
      break;
  }

  return type;
}

export function revertTypeQuestion(_text) {
  let text = "";
  switch (_text) {
    case 0:
      text = EXAM_TYPE_QUESTION.YES_NO;
      break;
    case 1:
      text = EXAM_TYPE_QUESTION.SINGLE_CHOICE;
      break;
    case 2:
      text = EXAM_TYPE_QUESTION.MULTIPLE_CHOICE;
      break;
    case 3:
      text = EXAM_TYPE_QUESTION.FILL_IN_BLANK;
      break;
    case 4:
      text = EXAM_TYPE_QUESTION.WORD_CHOICE;
      break;
    case 5:
      text = EXAM_TYPE_QUESTION.WORD_MATCH;
      break;
    case 6:
      text = EXAM_TYPE_QUESTION.ESSAY;
      break;
    default:
      break;
  }

  return text;
}

const filters = {
  toThousandFilter,
  uppercaseFirst,
  numeralFormat,
  fileSizeFilter,
  truncStrFilter,
  exCate2Txt,
  exType2Txt,
  subResult2Txt,
  withdrawalStatus2Txt,
  transactionStatus2Txt,
  convertBreadcrumText,
  getExerciseTypeText,
  getTestTypeText,
  getElearningTypeText,
  getQuestionNoText,
  getDateTimeFullText,
  getDateBirthday,
  formatHour,
  resultFigureRate,
  formatMMSS,
  capitalizeFirstLetter,
  capitalizeFirstLetterOfString,
  exType2TxtExam,
  exType2TxtLevel,
  exType2TxtTypeQues,
  getCommonTestTypeText,
  getExerciseResultText,
  exPublishStatus2Txt
};

// register global utility filters
export default Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
