// supposed to check en el data 
// sent men el frontend is correct 
// before it hits the controllers

export const validate = (rules) => {
  return (req, res, next) => {
    const errors = {};

    const body = req.body || {};

    for (const [field, config] of Object.entries(rules)) {
      const value = body[field];

      // required check
      if (config.required && (value === undefined || value === null || value === "")) {
        errors[field] = config.message || `${field} is required`;
        continue;
      }

      if (value === undefined || value === null) continue;

      // string type checks
      if (config.type === "string" || typeof value === "string") {
        if (config.minLength && value.length < config.minLength) {
          errors[field] =
            config.message ||
            `${field} must be at least ${config.minLength} characters`;
        }
        if (config.maxLength && value.length > config.maxLength) {
          errors[field] =
            config.message ||
            `${field} must be at most ${config.maxLength} characters`;
        }
      }

      // simple email check
      if (config.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(value))) {
          errors[field] = config.message || `${field} must be a valid email`;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    next();
  };
};
