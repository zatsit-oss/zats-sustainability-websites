import { defineCollection, z } from 'astro:content';

const peopleCollection = defineCollection({
  type: 'data',
  schema: z.object({
    photos: z.array(z.object({
      src: z.string(),
      alt: z.string(),
    })),
    stats: z.array(z.object({
      value: z.string(),
      label: z.string(),
      icon: z.string(),
    })),
    contractTypes: z.array(z.object({
      type: z.string(),
      icon: z.string(),
    })),
    leadership: z.array(z.object({
      name: z.string(),
      role: z.string(),
      linkedin: z.string(),
      github: z.string().optional(),
      photo: z.string().optional(),
    })),
    testimonials: z.array(z.object({
      name: z.string(),
      role: z.string(),
      quote: z.string(),
    })),
  }),
});

const legalCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    titleHighlight: z.string(),
    description: z.string(),
    lastUpdated: z.string().optional(),
    sections: z.array(z.object({
      id: z.string(),
      title: z.string(),
      content: z.string(),
      link: z.object({
        text: z.string(),
        url: z.string(),
      }).optional(),
    })),
  }),
});

const sdlcPhase = z.enum([
  'cadrage',
  'conception',
  'implementation',
  'tests',
  'deploiement',
  'mco',
]);

const servicesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    sectionTitle: z.string(),
    sectionTitleHighlight: z.string(),
    sectionDescription: z.string(),
    // Toggle "Traditionnel <-> AI Driven"
    traditionalLabel: z.string().default('Ingénierie artisanale'),
    aiLabel: z.string().default('Augmentée'),
    aiHint: z.string().optional(),
    aiTrackPrefix: z.string().default('// harness'),
    items: z.array(z.object({
      id: z.string(),
      title: z.string(),
      icon: z.string(),
      description: z.string(),
      // Preserved from the previous design (kept for future reuse)
      technologies: z.array(z.string()),
      tags: z.array(z.string()),
      // SDLC positioning
      sdlcLabel: z.string(),
      sdlcPhases: z.array(sdlcPhase).default([]),
      transverse: z.boolean().default(false),
      // AI Driven "// harness" parallel track
      aiTrackTitle: z.string().optional(),
      aiMethodologies: z.array(z.string()).default([]),
    })),
  }),
});

const techCollection = defineCollection({
  type: 'data',
  schema: z.object({
    intro: z.object({
      title: z.string(),
      titleHighlight: z.string(),
      description: z.string(),
    }),
    stats: z.array(z.object({
      value: z.string(),
      label: z.string(),
      icon: z.string(),
    })),
    roles: z.array(z.object({
      role: z.string(),
      icon: z.string(),
    })),
    stacks: z.array(z.object({
      name: z.string(),
      icon: z.string(),
      technologies: z.array(z.string()),
    })),
    methodologies: z.array(z.object({
      title: z.string(),
      description: z.string(),
      icon: z.string(),
    })),
  }),
});

export const collections = {
  legal: legalCollection,
  services: servicesCollection,
  people: peopleCollection,
  tech: techCollection,
};
