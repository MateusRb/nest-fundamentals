import { right, left, Either } from '@/core/either'

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(10)
  } else {
    return left('error')
  }
}

test('success result', () => {
  const successResult = doSomething(true)
  expect(successResult.isRight()).toBeTruthy()
  expect(successResult.isLeft()).toBeFalsy()
})

test('error result', () => {
  const successResult = doSomething(false)
  expect(successResult.isLeft()).toBeTruthy()
  expect(successResult.isRight()).toBeFalsy()
})
