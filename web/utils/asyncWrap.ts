type AsyncWrapResult<Resolve, Reject> = [Resolve, undefined] | [undefined, Reject];

export async function asyncWrap<Resolve, Reject = Error>(
  promise: Promise<Resolve>,
): Promise<AsyncWrapResult<Resolve, Reject>> {
  try {
    return [await promise, undefined];
  } catch (reject) {
    return [undefined, reject as Reject];
  }
}
