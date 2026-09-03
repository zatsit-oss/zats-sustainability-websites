# Pages & Components

Documentation of all pages and components on the **zatsit** website.

---

## Global Components

These components appear on every page.

### Header (`src/components/Header.astro`)

**Purpose**: Main navigation and brand identity.

**Elements**:
- Logo (links to homepage)
- Navigation links, in order, each hidden when its page is disabled through `DISABLED_PAGES`:
  - Accueil → `/`
  - L'équipe → `/team/`
  - Notre tech → `/tech/`
  - Rejoins-nous → `/join-us/`
  - Travaillons ensemble → `/work-with-us/`
  - Nos offres d'emploi → `/careers/`
  - Nous trouver → `/find-us/`
  - Nos offres d'emplois → LinkedIn jobs (external)
- Contact email (desktop only)
- Theme toggle (light/dark)
- Mobile menu (hamburger)

**Behavior**:
- Sticky on scroll
- Glass effect background
- Mobile menu toggles on button click

---

### Footer (`src/components/Footer.astro`)

**Purpose**: Secondary navigation, contact info, and legal links.

**Sections**:

1. **Mission** (left, 2 columns)
   - Zatsit logo
   - Mission statement
   - EcoVadis Silver badge

2. **Contact**
   - Email: contact@zatsit.fr
   - Address: Euratechnopole, Lille

3. **Social Links**
   - Blog
   - GitHub
   - LinkedIn
   - Twitter/X
   - Welcome to the Jungle

4. **Copyright Bar**
   - Copyright with current year
   - Legal notice link → `/legal-notice`
   - Privacy policy link → `/privacy-policy`

---

## Homepage (`src/pages/index.astro`)

**URL**: `/`

**Purpose**: Present Zatsit's mission, values, services, and calls-to-action for clients and consultants.

### Sections (in order):

#### 1. Hero (`src/components/sections/Hero.astro`)

**Purpose**: Immediate impact statement.

**Content**:
- Main headline: "La tech au service de l'**impact** des entreprises."
- Decorative gradient blobs in background

**No CTA** - lets the message breathe.

---

#### 2. Impact Sociétal (`src/components/sections/ImpactSocietal.astro`)

**Purpose**: Highlight social responsibility and open source initiatives.

**Key messages**:
- Investment in associations and charities
- Transparent and shared governance
- Open source initiatives on GitHub

**CTA**: Link to GitHub

---

#### 3. Impact Environnemental (`src/components/sections/ImpactEnvironmental.astro`)

**Purpose**: Highlight eco-responsibility commitments.

**Key messages**:
- Eco-designed websites
- Optimized development for minimal environmental impact
- Partners: Framework, Ekip, BCorp orientation

**Elements**:
- Partner badges (Framework, Ekip, BCorp)
- Link to blog for green computing articles

---

#### 4. Consultants (`src/components/sections/Consultants.astro`)

**Purpose**: Attract potential consultants by explaining the Zatsit model.

**Key messages**:
- Choose your status (employee, freelance, portage)
- Valued contributions
- Shared governance
- Drive initiatives
- Collective expertise

**CTA**: "Découvre ton futur package" → `/careers`

---

#### 5. Clients (`src/components/sections/Clients.astro`)

**Purpose**: Attract potential clients by positioning Zatsit as a strategic partner.

**Key messages**:
- Experience and technology expertise
- Strategic partner for tech challenges
- Passionate and experienced consultants

**CTA**: "Rejoins-nous" → `/join-us/`

---

#### 6. Services (`src/components/sections/Services.astro`)

**Purpose**: Showcase Zatsit's service offerings.

**Services** (6 cards):

| Service | Icon | Technologies |
|---------|------|--------------|
| Artisans du code | code-bracket | Java, .NET, Rust, JS, TS, Spring |
| Excellence mobile | device-mobile | Flutter, Android, iOS |
| Déploiements automatisés | rocket | GitHub Actions, Helm, Terraform, Ansible |
| (Cloud) Architectures | cloud | OpenAPI, C4Model, Diagram-as-code |
| Conseil et expertise | briefcase | Audit, Workshops, CTO as a Service |
| Formations | academic-cap | BBL, Formations, Open Source |

Each card includes:
- Icon
- Title
- Description
- Technology tags
- Hashtags

---

## Secondary Pages

### Join Us (`src/pages/join-us.astro`)

**URL**: `/join-us`

**Purpose**: Contact page for potential clients.

**Content**:
- Headline: "Rejoins-nous"
- Brief invitation to discuss projects
- CTA: Email link to contact@zatsit.fr

---

### Careers (`src/pages/careers.astro`)

**URL**: `/careers`

**Purpose**: Redirect to job offers.

**Content**:
- Headline: "Nos offres d'emploi"
- Invitation to join the collective
- CTA: Link to Welcome to the Jungle

---

### Find Us (`src/pages/find-us.astro`)

**URL**: `/find-us`

**Purpose**: Location and contact information.

**Content**:
- Address card (Euratechnopole, Lille)
- Contact card (email)

---

### Legal Notice (`src/pages/legal-notice.astro`)

**URL**: `/legal-notice`

**Purpose**: Legal requirements (mentions légales).

**Sections**:
- Site editor info
- Contact
- Hosting (Firebase)
- Intellectual property

---

### Privacy Policy (`src/pages/privacy-policy.astro`)

**URL**: `/privacy-policy`

**Purpose**: GDPR compliance.

**Sections**:
- Data collection (none, except theme preference)
- Email contact handling
- User rights (GDPR)
- Hosting information
