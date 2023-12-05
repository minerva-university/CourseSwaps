const validateFormData = (formData, fieldsToValidate = []) => {
  let errors = {};
  let formIsValid = true;

  // Check for required fields
  if (typeof formData.class === "string" && !formData.class.trim()) {
    errors.class = "Class is required";
    formIsValid = false;
  }

  if (typeof formData.major === "string" && !formData.major.trim()) {
    errors.major = "Major is required";
    formIsValid = false;
  }

  // Validate Previous Courses
  if (formData.previousCourses && formData.previousCourses.length === 0) {
    errors.previousCourses = "Select at least one previous course";
    formIsValid = false;
  }
  // if (
  //   typeof formData.concentration === "string" &&
  //   !formData.concentration.trim()
  // ) {
  //   errors.concentration = "Concentration is required";
  //   formIsValid = false;
  // } else if (
  //   Array.isArray(formData.concentration) &&
  //   formData.concentration.length === 0
  // ) {
  //   errors.concentration = "Concentration is required";
  //   formIsValid = false;
  // }

  // Check Minerva ID is exactly 6 numeric characters
  if (
    typeof formData.minervaID === "string" &&
    !/^\d{6}$/.test(formData.minervaID)
  ) {
    errors.minervaID = "Minerva ID must be 6 numeric characters";
    formIsValid = false;
  }

  // Filter out errors for fields that are not in fieldsToValidate
  errors = Object.keys(errors)
    .filter(
      (key) => fieldsToValidate.includes(key) || fieldsToValidate.length === 0
    )
    .reduce((obj, key) => {
      obj[key] = errors[key];
      return obj;
    }, {});

  return { isValid: formIsValid, errors };
};

export default validateFormData;
