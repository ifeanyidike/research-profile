// Text editors keep their own throwing save contract; checkboxes/buttons use this.
export function progressActions(report) {
  return (action, revert = () => {}) => {
    try {
      action();
      return true;
    } catch (error) {
      revert();
      report(error.message);
      return false;
    }
  };
}
