import { StorageService } from './storage.service'

describe('StorageService', () => {
  const getItemSpy = jest.spyOn(Storage.prototype, 'getItem')
  const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

  beforeEach(() => {
    StorageService.set('testkey', 'test')
    StorageService.set('testjson', {
      test: 'test'
    })
  })

  afterEach(() => {
    getItemSpy.mockClear()
    setItemSpy.mockClear()
  })

  it('should get a non-existing item', () => {
    const data = StorageService.getAs<string>('nonexisting')

    expect(getItemSpy).toBeCalledTimes(1)
    expect(getItemSpy).toBeCalledWith('nonexisting')
    expect(data).toBeUndefined()
  })

  it('should get a string item', () => {
    const data = StorageService.getAs<string>('testkey')

    expect(getItemSpy).toBeCalledTimes(1)
    expect(getItemSpy).toBeCalledWith('testkey')
    expect(typeof data).toEqual('string')
    expect(data).toEqual('test')
  })

  it('should get a JSON item', () => {
    const data = StorageService.getAs<{ test: string }>('testjson')

    expect(getItemSpy).toBeCalledTimes(1)
    expect(getItemSpy).toBeCalledWith('testjson')
    expect(typeof data).toEqual('object')
    expect(data).toEqual({
      test: 'test'
    })
  })
})
