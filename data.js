/* Constantes sourcées — voir la section « Sources et calculs » de la page et calc.js */
(function (root) {
  var C = {
    L_SUN: 3.828e26,        // W — luminosité solaire nominale, IAU 2015 Résolution B3
    S0: 1361,               // W/m² — irradiance solaire totale nominale, IAU 2015 B3
    R_SUN: 6.957e8,         // m — rayon solaire nominal, IAU 2015 B3
    T_EFF: 5772,            // K — température effective nominale, IAU 2015 B3
    R_EARTH: 6.371e6,       // m — rayon moyen volumétrique de la Terre, NASA NSSDC
    VOL_RATIO_NSSDC: 1304000, // Vsoleil/Vterre, NASA NSSDC Sun Fact Sheet
    T_CORE: 1.571e7,        // K — température centrale, NASA NSSDC
    MASS_CONV_NSSDC: 4.26e9,// kg/s — taux de conversion de masse, NASA NSSDC
    AU: 1.495978707e11,     // m — unité astronomique, IAU 2012 B2 (exacte)
    C_LIGHT: 299792458,     // m/s — exacte (SI)
    H_MASS_FRACTION: 0.0071,// fraction de masse convertie en énergie H→He (OpenStax Astronomy 2e)
    TNT_T: 4.184e9,         // J par tonne de TNT (convention)
    HIROSHIMA_KT: 15,       // kt — LANL LA-8819 (1985), meilleure estimation
    TSAR_MT: 50,            // Mt — Tsar Bomba, 30/10/1961 (AIEA, Nuclear Museum)
    WORLD_EJ: 592.22,       // EJ — approvisionnement énergétique total mondial 2024, EI Statistical Review 2025
    BELGIUM_EJ: 2.25,       // EJ — Belgique 2024, même source
    PHONE_WH: 15,           // Wh — HYPOTHÈSE : batterie de smartphone typique (~12 à 20 Wh)
    YEAR_S: 365.25 * 86400,
    COAL_EJ: 165.06,        // EJ — charbon, approvisionnement total 2024, EI Statistical Review 2025
    NUCLEAR_EJ: 30.74,      // EJ — nucléaire (équivalent chaleur d'entrée), 2024, EI 2025
    NUCLEAR_TWH: 2817.5,    // TWh — production électrique nucléaire mondiale 2024, EI 2025
    TOA_MEAN: 340,          // W/m² — rayonnement solaire moyen au sommet de l'atmosphère, GIEC AR6 GT1 fig. 7.2
    SURF_DOWN: 185,         // W/m² — rayonnement solaire descendant moyen à la surface, GIEC AR6 GT1 fig. 7.2
    LAND_KM2: 148.8e6,      // km² — terres émergées (29,2 % de la surface), UN Atlas of the Oceans / NOAA
    EARTH_SURF_KM2: 510.1e6,// km² — surface totale de la Terre, même source
    SAHARA_KM2: 8.6e6,      // km² — Sahara, Britannica (≈ 8,6 millions de km²)
    PV_EFF: 0.227,          // rendement moyen des modules c-Si livrés fin 2024, Fraunhofer ISE Photovoltaics Report 2025
    PV_PR: 0.80,            // ratio de performance initial d'un système PV, Fraunhofer ISE (typique 80–90 %)
    SRREN_MIN_EJ: 1575,     // EJ/an — potentiel technique solaire mondial (min), GIEC SRREN 2011 tab. 3.1
    SRREN_MAX_EJ: 49837     // EJ/an — idem (max)
  };
  var D = {};
  D.earthCross = Math.PI * C.R_EARTH * C.R_EARTH;                // m²
  D.P_EARTH = C.S0 * D.earthCross;                               // W
  D.fractionEarth = (C.R_EARTH * C.R_EARTH) / (4 * C.AU * C.AU);
  D.oneIn = 1 / D.fractionEarth;
  D.L_from_S0 = 4 * Math.PI * C.AU * C.AU * C.S0;                // W (cohérence)
  D.massLoss = C.L_SUN / (C.C_LIGHT * C.C_LIGHT);                // kg/s
  D.hFused = D.massLoss / C.H_MASS_FRACTION;                     // kg/s
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
  D.lightTime = C.AU / C.C_LIGHT;                                // s
  D.NUCLEAR_J = C.NUCLEAR_EJ * 1e18;
  D.NUCLEAR_ELEC_J = C.NUCLEAR_TWH * 3.6e15;
  D.COAL_J = C.COAL_EJ * 1e18;
  D.surfFrac = C.SURF_DOWN / C.TOA_MEAN;                         // part qui atteint la surface
  D.P_SURF = D.P_EARTH * D.surfFrac;                             // W
  D.landFrac = C.LAND_KM2 / C.EARTH_SURF_KM2;
  D.P_LAND = D.P_SURF * D.landFrac;                              // W (hypothèse : irradiance moyenne identique sur terre et mer)
  D.P_SAHARA_SUN = C.SAHARA_KM2 * 1e6 * C.SURF_DOWN;             // W (prudent : moyenne mondiale)
  D.saharaShareOfLand = C.SAHARA_KM2 / C.LAND_KM2;
  D.humanPower = D.WORLD_J / C.YEAR_S;                           // W moyens
  D.pvSahara100 = D.P_SAHARA_SUN * C.PV_EFF * C.PV_PR;           // W électriques si 100 % du Sahara couvert
  D.saharaPctForHumanity = 100 * D.humanPower / D.pvSahara100;
  D.secFor = function (J) { return J / D.P_EARTH; };
  root.SOLEIL = { C: C, D: D };
  if (typeof module !== 'undefined') module.exports = root.SOLEIL;
})(typeof window !== 'undefined' ? window : globalThis);
