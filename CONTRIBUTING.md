# Contributing to CourseSwaps

Here is a simple guide to contributing to CourseSwaps. Please read it before making a pull request.

## Getting Started

To contribute to the project, follow these steps:

1. create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. In the root directory, there is a script called `format_code.py` that will format your code to the correct style using `black`. You can run it with `python3 format_code.py`. Before you commit, make sure to run this script.
7. For Javascript, make sure you format your code with `prettier`. You can either install the extension for your editor or run `npx prettier --write "**/*.{js,jsx,ts,tsx}"` in the root directory.
8. If your code does not pass the tests or lintin(you will see this in the pull request), fix the issues.
9. In your pull request, make sure to include a description of what you did. Use the template provided below. For all frontend changes, please include screenshots of the changes.
    ``` markdown
        Title: [Brief description of the change]

        ## Description

        [Provide a detailed description of the changes you have made. Explain what you have changed and why. If the PR addresses a specific issue or feature request from the issue tracker, include a link to that issue.]

        ## Type of Change

        - [ ] Bug fix (non-breaking change which fixes an issue)
        - [ ] New feature (non-breaking change which adds functionality)
        - [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
        - [ ] Documentation update

        ## How Has This Been Tested?

        [Describe the tests that you ran to verify your changes. Provide instructions so reviewers can reproduce. Please also list any relevant details for your test configuration.]

        ## Checklist:

        - [ ] My code follows the project's style guidelines
        - [ ] I have performed a self-review of my own code
        - [ ] I have commented my code, particularly in hard-to-understand areas
        - [ ] I have made corresponding changes to the documentation
        - [ ] My changes generate no new warnings
        - [ ] Any dependent changes have been merged and published in downstream modules

        ## Screenshots (if applicable):

        [If your changes have visual components, please add screenshots showing the affected pages.]

        ## Additional Context

        [Add any other context or screenshots about the pull request here.]

    ```
11. Issue that pull request!
