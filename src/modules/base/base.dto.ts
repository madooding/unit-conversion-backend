export class BaseDto {
  constructor(data?: BaseDto) {
    Object.assign(this, data)
  }
}
