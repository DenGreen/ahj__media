import Controller from "../controller/controller";
const controller = new Controller();

test("Ввод координат без пробела ", () => {
  const expected = true;
  const received = controller.validatorPattern('51.50851,−0.12572');
  expect(received).toEqual(expected);
});

test("Ввод координат c пробелом ", () => {
  const expected = true;
  const received = controller.validatorPattern('51.50851, −0.12572');
  expect(received).toEqual(expected);
});

test("Ввод координат c квадратными скобками ", () => {
  const expected = true;
  const received = controller.validatorPattern('[51.50851, −0.12572]');
  expect(received).toEqual(expected);
});

test.each([
  {a: '51.50851,−0.12572]', expected: false,},
  {a: '[51.50851, −0.12572', expected: false},
])('Ввод координат c одной квадратной скобкой', ({a, expected}) => {
  let validation = controller.validatorPattern(a);
  expect(validation).toBe(expected);
});

test("Ввод пустой строки", () => {
  const expected = false;
  const received = controller.validatorPattern('');
  expect(received).toEqual(expected);
});