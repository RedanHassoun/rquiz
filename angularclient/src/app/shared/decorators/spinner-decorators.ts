import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

const indicatorSubject = new BehaviorSubject<boolean>(false);
export const isLoading$ = indicatorSubject.asObservable().pipe(distinctUntilChanged());

export function StartLoadingIndicator(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalValue = descriptor.value;
    descriptor.value = function(this: Function, ...args: any[]) {
        indicatorSubject.next(true);
        const result = originalValue.call(this, ...args);
        return result;
    };
    return descriptor;
}

export function StopLoadingIndicator(target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) {
    const original = propertyDescriptor.value;
    propertyDescriptor.value = function(this: Function, ...args: any[]) {
        indicatorSubject.next(false);
        const result = original.call(this, ...args);
        return result;
    };
    return propertyDescriptor;
}
