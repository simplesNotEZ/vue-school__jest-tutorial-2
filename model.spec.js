import Model from './model.js';

function createModel(data = [], options = {}) {
  return new Model({
    ...options,
    // object property value shorthand: data: data
    data
  });
}

it('createModel works', () => {
  expect(createModel()).toBeInstanceOf(Model);
});

// This won't work because JavaScript is prototype-based. [I don't get it.]
// it('model structure', () => {
//   expect(createModel()).toEqual({
//     $collection: expect.any(Array),
//     record: expect.any(Function),
//     all: expect.any(Function),
//     find: expect.any(Function),
//     update: expect.any(Function)
//   });

// Instead, we must use the expect.objectContaining matcher additionally
it('model structure', () => {
  expect(createModel()).toEqual(
    expect.objectContaining({
      $collection: expect.any(Array),
      $options: expect.objectContaining({
        primaryKey: 'id'
      }),
      record: expect.any(Function),
      all: expect.any(Function),
      find: expect.any(Function),
      update: expect.any(Function)
    })
  );
});

describe('customizations', () => {
  it('we can customize the primaryKey', () => {
    const model = createModel([], {
      primaryKey: 'name'
    });
    expect(model.$options.primaryKey).toBe('name');
  });
});

describe('record', () => {
  const heroes = [{ id: 1, name: 'Batman' }, { name: 'Black Panther' }];

  it('can add data to the collection', () => {
    const model = createModel();
    model.record(heroes);
    expect(model.$collection).toEqual([
      heroes[0],
      { id: expect.any(Number), name: heroes[1].name }
    ]);
  });

  it('gets called when data is passed to Model', () => {
    const spy = jest.spyOn(Model.prototype, 'record');
    const model = createModel(heroes);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

// My version
// describe('my all', () => {
//   const heroes = [{ name: 'Rodney Mullen' }, { name: 'Lukas Jackson' }];

//   it('returns string when no heroes', () => {
//     const model = createModel();
//     expect(model.all()).toBe('Sorry, there are no heroes in the collection.');
//   });
//   it('returns heroes when there are heroes', () => {
//     const model = createModel(heroes);
//     expect(model.all()).toEqual(heroes);
//   });
// });

// VueSchool version
describe('all', () => {
  test('returns empty model', () => {
    const model = createModel();
    expect(model.all()).toEqual([]);
  });

  test('returns model data', () => {
    const model = createModel([{ name: 'Batman' }, { name: 'Joker' }]);
    expect(model.all().length).toBe(2);
  });

  test('original data stays intact', () => {
    const model = createModel([{ name: 'Batman' }]);
    const data = model.all();
    data[0].name = 'Dopeman';

    expect(model.$collection[0].name).toBe('Batman');
  });
});

describe('find', () => {
  const heroes = [
    { id: 1, name: 'Batman' },
    { id: 2, name: 'Black Panther' }
  ];

  it('returns null if nothing matches', () => {
    const model = createModel();
    expect(model.find(1)).toBe(null);
  });

  it('returns item if it matches', () => {
    const model = createModel(heroes);
    expect(model.find(2)).toEqual(heroes[1]);
  });
});

describe('update', () => {
  const heroesAndVillains = [{ id: 1, name: 'Batman' }];
  let model;

  beforeEach(() => {
    const dataset = JSON.parse(JSON.stringify(heroesAndVillains));
    model = createModel(dataset);
  });

  it('update an entry by id', () => {
    model.update(1, { name: 'Joker' });
    expect(model.find(1).name).toBe('Joker');
  });

  it('extend an entry by id', () => {
    model.update(1, { cape: true });
    expect(model.find(1)).toEqual(
      expect.objectContaining({
        name: 'Batman',
        cape: true
      })
    );
  });

  it('return false if no entry matches', () => {
    expect(model.update(2, {})).toBe(false);
  });
});

describe('remove', () => {
  const heroesAndVillains = [{ id: 1, name: 'Batman', cape: true }];
  let model;

  beforeEach(() => {
    const dataset = JSON.parse(JSON.stringify(heroesAndVillains));
    model = createModel(dataset);
  });

  it('deletes an item', () => {
    model.remove(1);
    expect(model.find(1)).toBe(null);
  });

  it('deletes property from an item', () => {
    model.remove(1, 'cape');
    expect(model.find(1)).toEqual(
      expect.not.objectContaining({
        cape: true
      })
    );
  });
});
