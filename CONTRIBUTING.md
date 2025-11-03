# Contributing to AOCTS

Thank you for your interest in contributing to the Advent of Code TypeScript Skeleton project! 

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Run tests: `npm test`
5. Build the project: `npm run build`

## Development Guidelines

### Adding New Utilities

When adding new utility functions:

1. **Performance First**: Focus on algorithmic efficiency and runtime optimization
2. **Type Safety**: Use strict TypeScript types with proper generics
3. **Documentation**: Include JSDoc comments explaining the purpose and complexity
4. **Testing**: Add comprehensive test cases covering edge cases
5. **Benchmarking**: Consider performance implications for competitive programming

### Code Style

- Use descriptive variable names
- Prefer immutable patterns where performance allows
- Document time and space complexity for algorithms
- Use `const` for values that don't change
- Avoid deep nesting (prefer early returns)

### Testing

- Write tests for all new utility functions
- Include edge cases and boundary conditions
- Use descriptive test names
- Group related tests with `describe` blocks

### Performance Considerations

- Use typed arrays for numerical computations when beneficial
- Avoid unnecessary object allocations in hot paths
- Pre-compile regex patterns that are used repeatedly
- Choose appropriate data structures (Set for membership, Map for key-value)
- Profile and benchmark performance-critical code

## Submitting Changes

1. Create a feature branch from `main`
2. Make your changes with appropriate tests
3. Ensure all tests pass
4. Update documentation if needed
5. Submit a pull request with a clear description

## Types of Contributions

- **New Algorithms**: Graph algorithms, string processing, mathematical functions
- **Data Structures**: Performance-optimized collections and containers
- **Utilities**: Input parsing, grid operations, geometric calculations
- **Tools**: Development utilities, benchmarking improvements
- **Documentation**: Examples, tutorials, performance guides
- **Bug Fixes**: Error corrections and edge case handling

## Performance Benchmarks

When adding new utilities, please include benchmark results showing:
- Time complexity verification
- Performance comparison with naive implementations
- Memory usage characteristics

## Questions?

Feel free to open an issue for discussion before starting work on major features.

Happy coding! 🎄