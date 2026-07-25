export interface HeroConcept {
  id: string;
  index: string;
  name: string;
  description: string;
}

// Shared between the selector bar and each concept's own on-canvas label —
// single source of truth so the two never drift out of sync.
export const heroConcepts: HeroConcept[] = [
  {
    id: "hero-01",
    index: "01",
    name: "Cinématique éditorial",
    description: "Campagne plein écran, typographie cinématique, mask-reveal au chargement.",
  },
  {
    id: "hero-02",
    index: "02",
    name: "Typographique",
    description: "Le texte comme sujet principal — l'image comme calque, pas comme fond.",
  },
  {
    id: "hero-03",
    index: "03",
    name: "Parallaxe immersif",
    description: "Profondeur cinématique, deux vitesses de défilement, indicateur de progression.",
  },
  {
    id: "hero-04",
    index: "04",
    name: "Split éditorial",
    description: "Composition en deux volets, interaction au survol, transition entre les côtés.",
  },
  {
    id: "hero-05",
    index: "05",
    name: "Expérimental",
    description: "Calques, masques, étiquettes flottantes, interaction au curseur — le plus créatif.",
  },
];
