import '@testing-library/jest-dom/vitest';

global.ResizeObserver = class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
};

// happy-dom implémente l'API Web Animations, contrairement aux navigateurs simulés
// habituels. Framer Motion emprunte alors un chemin d'animation qui laisse des
// promesses rejetées au démontage des composants.
if (typeof Element !== 'undefined') {
    Reflect.deleteProperty(Element.prototype, 'animate');
}