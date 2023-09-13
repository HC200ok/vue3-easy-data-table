import { describe, it, expect } from 'vitest';
import { areItemsEqual, getItemIndex } from '../src/utils';

interface User {
  id: string;
  name: string;
  lastName: string;
}

describe('Utils functions', () => {
  describe('areItemsEqual()', () => {
    it('should return true using the object key', () => {
      const leftItem: User = { id: '1', name: 'John', lastName: 'Doe' };
      const rightItem: User = { id: '1', name: 'John', lastName: 'Does' };
      expect(areItemsEqual(leftItem, rightItem, 'id')).toBe(true);
    });

    it('should return true using the function key', () => {
      const leftItem: User = { id: '1', name: 'John', lastName: 'Doe' };
      const rightItem: User = { id: '2', name: 'John', lastName: 'Doe' };
      const keyFn = (item: User) => item.name + item.lastName;
      expect(areItemsEqual(leftItem, rightItem, keyFn as any)).toBe(true);
    });

    it('should return true using an undefined key', () => {
      const leftItem: User = { id: '1', name: 'John', lastName: 'Doe' };
      const rightItem: User = { id: '1', name: 'John', lastName: 'Doe' };
      expect(areItemsEqual(leftItem, rightItem, undefined)).toBe(true);
    });
  });

  it('getItemIndex()', () => {
    const users: User[] = [
      { id: '1', name: 'John', lastName: 'Doe' },
      { id: '2', name: 'Ana', lastName: 'Wick' },
      { id: '3', name: 'Xuxu', lastName: 'Bar' },
    ];
    expect(getItemIndex(users, { id: '2' }, 'id')).toBe(1);
  });
});
