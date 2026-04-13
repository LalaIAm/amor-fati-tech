# Requirements Document

## Introduction

An AI-powered tarot card reading and journaling app that allows users to draw virtual tarot cards, receive AI-generated interpretations personalized to their question or intention, and maintain a private journal of past readings. The app combines traditional tarot symbolism with modern AI to provide meaningful, reflective experiences. Users can track patterns in their readings over time and use journaling prompts to deepen self-reflection.

## Glossary

- **App**: The AI-powered tarot card reading and journaling application
- **User**: A registered person using the App
- **Deck**: A complete set of 78 tarot cards (22 Major Arcana + 56 Minor Arcana)
- **Card**: A single tarot card with a name, imagery, and symbolic meaning
- **Reading**: A session in which one or more Cards are drawn and interpreted
- **Spread**: A predefined layout pattern that determines how many Cards are drawn and what position each Card occupies (e.g., single card, three-card past/present/future, Celtic Cross)
- **Position**: A named slot within a Spread that gives contextual meaning to the Card placed there
- **Interpretation**: An AI-generated textual explanation of a Card within the context of a Spread Position and the User's stated intention
- **Intention**: A question, theme, or focus the User provides before a Reading
- **Journal**: A private, persistent collection of a User's past Readings and personal notes
- **Journal_Entry**: A single record in the Journal containing a Reading, its Interpretation, and optional User notes
- **AI_Engine**: The AI service responsible for generating Interpretations
- **Reversed_Card**: A Card drawn in an upside-down orientation, which carries an alternate or modified meaning

---

## Requirements

### Requirement 1: User Account Management

**User Story:** As a new user, I want to create an account and log in, so that my readings and journal are private and persistent across sessions.

#### Acceptance Criteria

1. THE App SHALL allow a User to register with a unique email address and password.
2. WHEN a User submits a registration form with a valid email and password of at least 8 characters, THE App SHALL create a new account and log the User in.
3. IF a User attempts to register with an email address already associated with an existing account, THEN THE App SHALL display an error message indicating the email is already in use.
4. WHEN a registered User submits valid credentials, THE App SHALL authenticate the User and begin a new session.
5. IF a User submits incorrect credentials, THEN THE App SHALL display an error message and SHALL NOT grant access.
6. WHEN a User requests to log out, THE App SHALL end the session and redirect the User to the login screen.
7. WHERE third-party authentication is enabled, THE App SHALL allow a User to register and log in using an OAuth provider.

---

### Requirement 2: Tarot Card Deck

**User Story:** As a user, I want to draw from a complete, standard tarot deck, so that my readings are based on authentic tarot tradition.

#### Acceptance Criteria

1. THE App SHALL maintain a Deck of exactly 78 Cards, comprising 22 Major Arcana and 56 Minor Arcana.
2. THE App SHALL associate each Card with a name, arcana type, suit (where applicable), imagery description, and upright and reversed keyword meanings.
3. WHEN a Reading begins, THE App SHALL shuffle the Deck using a randomization algorithm that gives each Card an equal probability of selection.
4. THE App SHALL support Reversed_Cards, where each Card has an equal probability of being drawn in a reversed orientation.
5. WHEN a Card is drawn for a Reading, THE App SHALL display the Card's name and imagery to the User.

---

### Requirement 3: Spread Selection

**User Story:** As a user, I want to choose from different spread layouts, so that I can tailor the reading to my question or situation.

#### Acceptance Criteria

1. THE App SHALL offer at least three built-in Spreads: a single-card draw, a three-card spread (past/present/future), and a Celtic Cross spread (10 cards).
2. WHEN a User selects a Spread, THE App SHALL display a description of the Spread and the meaning of each Position before the Reading begins.
3. WHEN a Reading begins, THE App SHALL draw the exact number of Cards required by the selected Spread.
4. THE App SHALL display each drawn Card in its corresponding Position within the Spread layout.

---

### Requirement 4: Intention Setting

**User Story:** As a user, I want to set an intention or question before my reading, so that the AI interpretation is relevant to my situation.

#### Acceptance Criteria

1. WHEN a User initiates a Reading, THE App SHALL prompt the User to enter an optional Intention of up to 500 characters.
2. WHEN an Intention is provided, THE AI_Engine SHALL incorporate the Intention into the Interpretation for each Card Position.
3. WHEN no Intention is provided, THE AI_Engine SHALL generate a general Interpretation based on the Card and its Position.
4. THE App SHALL display the User's Intention alongside the Reading in the Journal_Entry.

---

### Requirement 5: AI-Generated Interpretations

**User Story:** As a user, I want to receive a personalized AI interpretation of my cards, so that I can gain meaningful insight from my reading.

#### Acceptance Criteria

1. WHEN a Reading is completed, THE AI_Engine SHALL generate an Interpretation for each drawn Card that references the Card's name, its orientation (upright or reversed), its Position meaning, and the User's Intention.
2. THE AI_Engine SHALL generate Interpretations that are coherent, contextually relevant, and between 100 and 400 words per Card.
3. WHEN the AI_Engine is called, THE App SHALL display a loading indicator until the Interpretation is returned.
4. IF the AI_Engine fails to return an Interpretation within 30 seconds, THEN THE App SHALL display an error message and offer the User the option to retry.
5. THE AI_Engine SHALL generate a summary Interpretation for the Reading as a whole, synthesizing the individual Card Interpretations in the context of the Intention.
6. WHEN a User requests a new Reading with the same Spread and Intention, THE AI_Engine SHALL generate a distinct Interpretation that differs meaningfully from prior Interpretations.

---

### Requirement 6: Journal Management

**User Story:** As a user, I want to save and review my past readings in a journal, so that I can track patterns and reflect on my journey over time.

#### Acceptance Criteria

1. WHEN a Reading and its Interpretations are complete, THE App SHALL automatically save a Journal_Entry containing the date, Spread used, Intention, drawn Cards with orientations, and all Interpretations.
2. THE App SHALL display the User's Journal as a chronologically ordered list of Journal_Entries, with the most recent entry first.
3. WHEN a User selects a Journal_Entry, THE App SHALL display the full details of that entry including all Cards, Positions, and Interpretations.
4. THE App SHALL allow a User to add, edit, or delete personal notes on any Journal_Entry after it is saved.
5. WHEN a User deletes a Journal_Entry, THE App SHALL prompt the User to confirm the deletion before permanently removing the entry.
6. THE App SHALL retain all Journal_Entries for a User until the User explicitly deletes them or closes their account.

---

### Requirement 7: Reading History and Pattern Insights

**User Story:** As a user, I want to see patterns in my readings over time, so that I can gain deeper self-awareness.

#### Acceptance Criteria

1. THE App SHALL track the frequency with which each Card appears across a User's Reading history.
2. WHEN a User views their Journal, THE App SHALL display a summary showing the User's three most frequently drawn Cards.
3. WHEN a User has completed at least five Readings, THE AI_Engine SHALL generate a monthly pattern insight summarizing recurring themes across the User's recent Journal_Entries.
4. THE App SHALL display the date and Spread type for each Journal_Entry in the Journal list view without requiring the User to open the entry.

---

### Requirement 8: Journaling Prompts

**User Story:** As a user, I want AI-generated journaling prompts based on my reading, so that I can reflect more deeply on the cards' messages.

#### Acceptance Criteria

1. WHEN a Reading is complete, THE AI_Engine SHALL generate three reflective journaling prompts tailored to the drawn Cards and the User's Intention.
2. THE App SHALL display the journaling prompts alongside the Interpretation within the Journal_Entry.
3. WHEN a User selects a journaling prompt, THE App SHALL open a text input field pre-populated with the prompt so the User can write a response.
4. THE App SHALL save the User's response to a journaling prompt as part of the Journal_Entry notes.

---

### Requirement 9: Privacy and Data Security

**User Story:** As a user, I want my journal and readings to be private and secure, so that I can reflect honestly without concern.

#### Acceptance Criteria

1. THE App SHALL store all User data, including Journal_Entries and personal notes, in an encrypted format at rest.
2. THE App SHALL transmit all data between the client and server using TLS 1.2 or higher.
3. THE App SHALL ensure that a User can only access Journal_Entries belonging to their own account.
4. IF a User requests account deletion, THEN THE App SHALL permanently delete all associated Journal_Entries, notes, and personal data within 30 days.
5. THE App SHALL not share or sell User data, including Journal_Entries and Intentions, to third parties.

---

### Requirement 10: Post-Login Dashboard

**User Story:** As a user, I want to see an overview of my past readings and insights after logging in, so that I can quickly reconnect with my journey and pick up where I left off.

#### Acceptance Criteria

1. WHEN a User successfully authenticates, THE App SHALL display a Dashboard as the first screen.
2. THE Dashboard SHALL display the User's three most recently saved Journal_Entries, including the date, Spread type, and Intention for each.
3. WHEN a User selects a Journal_Entry from the Dashboard, THE App SHALL navigate to the full detail view of that entry.
4. WHILE a User has completed at least five Readings, THE Dashboard SHALL display the User's most recently generated monthly pattern insight.
5. THE Dashboard SHALL display the User's three most frequently drawn Cards across all Readings.
6. WHEN a User has no Journal_Entries, THE Dashboard SHALL display a prompt encouraging the User to begin their first Reading.
7. THE Dashboard SHALL provide a clearly labeled action to start a new Reading.

---

### Requirement 11: Responsive and Accessible Interface

**User Story:** As a user, I want to use the app comfortably on any device, so that I can do readings wherever I am.

#### Acceptance Criteria

1. THE App SHALL render correctly on screen widths from 320px to 2560px without loss of functionality.
2. THE App SHALL provide keyboard navigation for all interactive elements.
3. THE App SHALL provide text alternatives for all Card imagery.
4. WHEN a User's device is set to a reduced-motion preference, THE App SHALL disable or reduce card animation effects.
5. THE App SHALL support both light and dark display modes, following the User's system preference by default.
