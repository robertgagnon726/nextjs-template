import _ from 'lodash';

export const camelCaseToSentenceCase = (camelCaseString: string): string => {
  // Add a space before each capital letter
  const sentenceCaseString = camelCaseString.replace(/([A-Z])/g, ' $1').trim();
  // Convert the whole string to lower case and capitalize the first letter
  return _.capitalize(sentenceCaseString.toLowerCase());
};
