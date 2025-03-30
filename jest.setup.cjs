require('@testing-library/jest-dom');
require('whatwg-fetch');

global.Request = Request;
global.Response = Response;

const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);
window.HTMLElement.prototype.scrollIntoView = () => {};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

window.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Polyfill Response.json if it's not available
if (typeof Response.prototype.json !== 'function') {
  Response.prototype.json = async function () {
    const text = await this.text();
    return JSON.parse(text);
  };
}
