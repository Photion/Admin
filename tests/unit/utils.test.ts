

import '~/tests/setup';
import { labelize, toOption } from '~/src/utils';


describe('unit.utils', () => {
  const labelTestCases = [
    { input: 'world', expected: 'World' },
    { input: 'hello world ', expected: 'Hello World' },
    { input: 'hello-world', expected: 'Hello World' },
    { input: 'hello-', expected: 'Hello' },
    { input: '-hello', expected: 'Hello' },
    { input: 'hELLO', expected: 'Hello' },
    { input: 'hELLO wOrld', expected: 'Hello World' },
    { input: 'Hello World!', expected: 'Hello World' },
    { input: 'h_e_l_l_o', expected: 'H E L L O' },
    { input: 'h_e_l_l_o__w_o_r_l_d', expected: 'H E L L O W O R L D' },
    { input: 'he77o', expected: 'He77o' },
    { input: 'h$llo', expected: 'H Llo' },
    { input: '4llo', expected: '4llo' },
    { input: '4llo world', expected: '4llo World' },
  ];

  describe('labelize', () => {
    labelTestCases.forEach((testCase) => {
      it(`'${testCase.input}' --> '${testCase.expected}'`, () => {
        const actual = labelize(testCase.input);
        expect(actual).toEqual(testCase.expected);
      });
    });
  });

  describe('toOption', () => {
    labelTestCases.forEach((labelTestCases) => {
      it(`Creates an option from '${labelTestCases.input}'`, () => {
        const actual = toOption(labelTestCases.input);
        const expected = {
          value: labelTestCases.input,
          text: labelTestCases.expected,
        };

        expect(actual).toEqual(expected);
      });
    });
  });

});
