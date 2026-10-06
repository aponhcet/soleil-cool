/* Constantes sourcées — voir la section « Sources et calculs » de la page et calc.js */
(function (root) {
  var C = {
    L_SUN: 3.828e26,
    S0: 1361,
    R_SUN: 6.957e8,
    T_EFF: 5772,
    R_EARTH: 6.371e6,
    VOL_RATIO_NSSDC: 1304000,
    T_CORE: 1.571e7,
    MASS_CONV_NSSDC: 4.26e9,
    AU: 1.495978707e11,
    C_LIGHT: 299792458,
    H_MASS_FRACTION: 0.0071,
    TNT_T: 4.184e9,
    HIROSHIMA_KT: 15,
    TSAR_MT: 50,
    WORLD_EJ: 592.22,
    BELGIUM_EJ: 2.25,
    PHONE_WH: 15,
    YEAR_S: 365.25 * 86400,
    COAL_EJ: 165.06,
    NUCLEAR_EJ: 30.74,
    NUCLEAR_TWH: 2817.5,
    TOA_MEAN: 340,
    SURF_DOWN: 185,
    LAND_KM2: 148.8e6,
    EARTH_SURF_KM2: 510.1e6,
    SAHARA_KM2: 8.6e6,
    PV_EFF: 0.227,
    PV_PR: 0.80,
    SRREN_MIN_EJ: 1575,
    SRREN_MAX_EJ: 49837
  };
  var D = {};
  D.earthCross = Math.PI * C.R_EARTH * C.R_EARTH;
  D.P_EARTH = C.S0 * D.earthCross;
  D.fractionEarth = (C.R_EARTH * C.R_EARTH) / (4 * C.AU * C.AU);
  D.oneIn = 1 / D.fractionEarth;
  D.L_from_S0 = 4 * Math.PI * C.AU * C.AU * C.S0;
  D.massLoss = C.L_SUN / (C.C_LIGHT * C.C_LIGHT);
  D.hFused = D.massLoss / C.H_MASS_FRACTION;
  D.HIROSHIMA_J = C.HIROSHIMA_KT * 1e3 * C.TNT_T;
  D.TSAR_J = C.TSAR_MT * 1e6 * C.TNT_T;
  D.hiroPerS = C.L_SUN / D.HIROSHIMA_J;
  D.tsarPerS = C.L_SUN / D.TSAR_J;
  D.earthHiroPerS = D.P_EARTH / D.HIROSHIMA_J;
  D.WORLD_J = C.WORLD_EJ * 1e18;
  D.BELGIUM_J = C.BELGIUM_EJ * 1e18;
  D.PHONE_J = C.PHONE_WH * 3600;
  D.earthSecondsForWorldYear = D.WORLD_J / D.P_EARTH;
  D.earthSecondsForBelgiumYear = D.BELGIUM_J / D.P_EARTH;
  D.worldYearsPerSunSecond = C.L_SUN / D.WORLD_J;
  D.earthOverWorldPower = D.P_EARTH / (D.WORLD_J / C.YEAR_S);
  D.diamRatio = C.R_SUN / C.R_EARTH;
  D.volRatio = Math.pow(D.diamRatio, 3);
  D.lightTime = C.AU / C.C_LIGHT;
  D.NUCLEAR_J = C.NUCLEAR_EJ * 1e18;
  D.NUCLEAR_ELEC_J = C.NUCLEAR_TWH * 3.6e15;
  D.COAL_J = C.COAL_EJ * 1e18;
  D.surfFrac = C.SURF_DOWN / C.TOA_MEAN;
  D.P_SURF = D.P_EARTH * D.surfFrac;
  D.landFrac = C.LAND_KM2 / C.EARTH_SURF_KM2;
  D.P_LAND = D.P_SURF * D.landFrac;
  D.P_SAHARA_SUN = C.SAHARA_KM2 * 1e6 * C.SURF_DOWN;
  D.saharaShareOfLand = C.SAHARA_KM2 / C.LAND_KM2;
  D.humanPower = D.WORLD_J / C.YEAR_S;
  D.pvSahara100 = D.P_SAHARA_SUN * C.PV_EFF * C.PV_PR;
  D.saharaPctForHumanity = 100 * D.humanPower / D.pvSahara100;
  D.secFor = function (J) { return J / D.P_EARTH; };
  root.SOLEIL = { C: C, D: D };
  if (typeof module !== 'undefined') module.exports = root.SOLEIL;
})(typeof window !== 'undefined' ? window : globalThis);
;/*! pile boot */(function(){function go(){if(window.__PILE_BOOT__)return;var s=document.createElement('script');s.src='boot-pile.js';document.body.appendChild(s)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go()})();
