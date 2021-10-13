import { CommonUtils } from './common.utils'

describe('CommonUtils', () => {
  it('should generate a correct avatar text', () => {
    const testCases = [
      {
        text: 'Test Cluster',
        expected: 'TC'
      },
      {
        text: 'test cluster',
        expected: 'TC'
      },
      {
        text: 'Test',
        expected: 'T'
      },
      {
        text: 'test',
        expected: 'T'
      },
      {
        text: 'super cooles test cluster',
        expected: 'SC'
      },
      {
        text: 'Super Cooles Test Cluster',
        expected: 'SC'
      }
    ]

    for (const testCase of testCases) {
      expect(CommonUtils.generateAvatarText(testCase.text)).toEqual(
        testCase.expected
      )
    }
  })
})
