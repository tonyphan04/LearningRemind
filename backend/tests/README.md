# Spaced Repetition System Tests

This folder contains tests for the spaced repetition system in the LearningRemind application.

## Test Organization

The tests are organized in the following structure:

```
tests/
├── run-spaced-repetition-tests.ts    # Main test runner
├── spaced-repetition/                # Spaced repetition tests
│   ├── test-all.ts                   # Comprehensive test of all features
│   ├── test-intervals.ts             # Tests for spaced repetition intervals
│   ├── test-due-collections.ts       # Tests for retrieving due collections
│   └── test-email-notifications.ts   # Tests for email notifications
```

## Running the Tests

### Run All Tests

To run the comprehensive test suite:

```bash
npm run test-spaced-repetition
```

### Run Specific Tests

To run a specific test, pass the test name as an argument:

```bash
# Run the comprehensive test
npm run test-spaced-repetition -- all

# Run just the intervals test
npm run test-spaced-repetition -- intervals

# Run just the due collections test
npm run test-spaced-repetition -- due-collections

# Run just the email notifications test
npm run test-spaced-repetition -- email
```

## Test Coverage

These tests cover the following aspects of the spaced repetition system:

1. **Intervals Test**
   - Creating a test user and collection
   - Creating initial review tasks
   - Simulating multiple review completions
   - Verifying interval progression
   - Resetting review progress

2. **Due Collections Test**
   - Setting review dates to today
   - Retrieving collections due for review
   - Testing user-specific and all-users queries

3. **Email Notifications Test**
   - Finding collections due for review
   - Mocking email notifications
   - Testing user-specific email grouping

4. **Comprehensive Test**
   - End-to-end testing of the entire spaced repetition workflow
   - Testing all components working together

## Adding New Tests

To add a new test:

1. Create a new test file in the `spaced-repetition` folder
2. Add the test name and file path to the `testFiles` object in `run-spaced-repetition-tests.ts`
3. Run the new test using `npm run test-spaced-repetition -- your-test-name`
