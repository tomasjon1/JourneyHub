export const validationMessages = {
  auth: {
    login: {
      email: {
        required: 'Email is required.',
        email: 'Please enter a valid email.',
      },
      password: {
        required: 'Password is required',
      },
    },
    register: {
      username: {
        required: 'Username is required',
        minlength: 'Username must be at least 4 characters long.',
        maxlength: 'Username cannot be more than 16 characters long.',
        pattern: 'Username must consist of letters and numbers only.',
      },
      email: {
        required: 'Email is required',
        email: 'Please enter a valid email.',
      },
      password: {
        required: 'Password is required',
        minlength: 'Password must be at least 8 characters long.',
        pattern:
          'Password must include uppercase and lowercase letters, a number, and a special character.',
      },
      confirmPassword: {
        required: 'Please repeat entered password.',
        mustMatch: 'Passwords must match.',
      },
    },
  },
  planning: {
    name: {
      required: 'Trail name is required.',
      minlength: 'Trail name must be at least 4 characters long.',
      maxlength: 'Trail name cannot be more than 16 characters long.',
    },
  },
};
