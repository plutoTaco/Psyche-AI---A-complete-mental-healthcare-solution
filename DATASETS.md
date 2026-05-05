# 📊 Datasets Used in Psyche AI

> A comprehensive list of all datasets, data structures, APIs, and static data used throughout the Psyche AI Mental Healthcare Solution.

---

## Table of Contents

1. [External APIs & AI Models](#1-external-apis--ai-models)
2. [AI Therapist Personas](#2-ai-therapist-personas)
3. [Doctors Directory](#3-doctors-directory)
4. [Community Forum Posts](#4-community-forum-posts)
5. [Mood Tracking System](#5-mood-tracking-system)
6. [Journal Prompts](#6-journal-prompts)
7. [Wellness & Breathing Patterns](#7-wellness--breathing-patterns)
8. [5-4-3-2-1 Grounding Exercise](#8-5-4-3-2-1-grounding-exercise)
9. [Wellness Resource Library](#9-wellness-resource-library)
10. [Emergency Contacts](#10-emergency-contacts)
11. [User Profile](#11-user-profile)
12. [User Preferences](#12-user-preferences)
13. [Navigation & Feature Map](#13-navigation--feature-map)
14. [Browser APIs](#14-browser-apis)

---

## 1. External APIs & AI Models

### Groq LLaMA 3.3 70B (AI Chatbot Engine)

| Field          | Value                                |
|----------------|--------------------------------------|
| **Provider**   | Groq Cloud                           |
| **Model**      | `llama-3.3-70b-versatile`            |
| **API SDK**    | `groq-sdk` v1.1.2                    |
| **Endpoint**   | `/api/chat` (internal Next.js route) |
| **Streaming**  | Yes (Server-Sent Events)             |
| **Temperature**| 0.7                                  |
| **Max Tokens** | 1024                                 |
| **Auth**       | `GROQ_API_KEY` (via `.env.local`)    |

**Purpose:** Powers the AI therapy chatbot with real-time streamed responses across 3 therapeutic personas.

---

## 2. AI Therapist Personas

Three distinct AI therapist profiles used as system prompts for the LLM:

| Persona ID | Name       | Specialty                 | Therapeutic Approach                                              |
|------------|------------|---------------------------|-------------------------------------------------------------------|
| `maya`     | Dr. Maya   | CBT Specialist            | Cognitive Behavioral Therapy, cognitive restructuring, thought records |
| `kai`      | Dr. Kai    | Mindfulness & Wellness    | MBSR, Acceptance and Commitment Therapy (ACT), positive psychology    |
| `ava`      | Ava        | Crisis Counselor          | Crisis de-escalation, safety planning, risk assessment                |

**Source File:** `src/app/api/chat/route.ts` (system prompts), `src/app/chat/page.tsx` (persona UI data)

---

## 3. Doctors Directory

Static dataset of 6 licensed mental health professionals for the doctor booking feature:

| ID | Name              | Specialty    | Rating | Reviews | Available | Bio Summary                                          |
|----|-------------------|-------------|--------|---------|-----------|------------------------------------------------------|
| 1  | Dr. Sarah Chen    | Psychiatrist | 4.9    | 127     | ✅ Yes    | Anxiety disorders & PTSD, 12 years experience        |
| 2  | Dr. James Rivera  | Psychologist | 4.8    | 98      | ✅ Yes    | CBT & relationship counseling                        |
| 3  | Dr. Priya Sharma  | Therapist    | 4.9    | 203     | ❌ No     | Mindfulness-based stress reduction, trauma recovery  |
| 4  | Dr. Michael Park  | Psychiatrist | 4.7    | 85      | ✅ Yes    | Medication management — depression, bipolar, ADHD    |
| 5  | Dr. Emily Watson  | Psychologist | 4.8    | 156     | ✅ Yes    | Adolescent psychology & family therapy               |
| 6  | Dr. Ahmed Hassan  | Therapist    | 4.6    | 72      | ❌ No     | Grief counseling & existential therapy, multilingual |

**Specialty Filters:** All, Psychiatrist, Psychologist, Therapist  
**Available Time Slots:** 9:00 AM, 10:00 AM, 11:00 AM, 1:00 PM, 2:00 PM, 3:00 PM, 4:00 PM  
**Source File:** `src/app/doctors/page.tsx`

---

## 4. Community Forum Posts

Sample dataset of 4 community forum posts with comments for peer support:

| Post ID | Author          | Anonymous | Category      | Title                                                   | Upvotes | Comments |
|---------|-----------------|-----------|---------------|---------------------------------------------------------|---------|----------|
| 1       | HopefulStar     | ✅ Yes    | Anxiety       | Small wins matter — I spoke up in a meeting today       | 24      | 2        |
| 2       | MountainClimber | ❌ No     | Recovery      | 6 months sober — things I've learned                    | 67      | 1        |
| 3       | SeaStar42       | ✅ Yes    | Depression    | Has anyone tried journaling? Does it actually help?     | 18      | 1        |
| 4       | SunflowerMind   | ✅ Yes    | Relationships | Setting boundaries with family — how do you cope?       | 31      | 0        |

**Forum Categories:** All, Anxiety, Depression, Relationships, Recovery, General  
**Sort Options:** Trending (by upvotes), Recent  
**Source File:** `src/app/community/page.tsx`

---

## 5. Mood Tracking System

### Mood Scale (5-point)

| Value | Emoji | Label    | Color Code |
|-------|-------|----------|------------|
| 1     | 😔    | Very Low | `#ef4444`  |
| 2     | 😟    | Low      | `#f97316`  |
| 3     | 😐    | Neutral  | `#eab308`  |
| 4     | 🙂    | Good     | `#22c55e`  |
| 5     | 😊    | Great    | `#10b981`  |

### Sample Mood Entries (7 pre-populated)

| Date       | Mood | Entry Summary                                          |
|------------|------|--------------------------------------------------------|
| 2025-03-25 | 4 🙂 | Productive day, confident during presentation          |
| 2025-03-24 | 3 😐 | Mixed feelings, evening walk helped                    |
| 2025-03-23 | 5 😊 | Connected with old friends, truly happy                |
| 2025-03-22 | 2 😟 | Struggled with anxiety, breathing exercises helped     |
| 2025-03-21 | 4 🙂 | Good workout, feeling energized                        |
| 2025-03-20 | 3 😐 | Average day, nothing special                           |
| 2025-03-19 | 4 🙂 | Progress on personal goal, feeling accomplished        |

**View Options:** 7-day trend, 30-day trend  
**Source File:** `src/app/log/page.tsx`

---

## 6. Journal Prompts

AI-powered daily journal prompt rotation (7 prompts):

| # | Prompt                                                      |
|---|-------------------------------------------------------------|
| 1 | What are three things you're grateful for today?            |
| 2 | Describe a moment today that made you smile.                |
| 3 | What's one thing you'd like to let go of?                   |
| 4 | How did you take care of yourself today?                    |
| 5 | What's something you're looking forward to?                 |
| 6 | Write about a challenge you overcame recently.              |
| 7 | What would you tell a friend who feels the way you do?      |

**Selection Method:** Random selection on page load  
**Source File:** `src/app/log/page.tsx`

---

## 7. Wellness & Breathing Patterns

Three guided breathing exercise patterns:

| Pattern Name    | Inhale | Hold | Exhale | Hold After | Description                                                     |
|-----------------|--------|------|--------|------------|-----------------------------------------------------------------|
| 4-7-8 Relaxing  | 4s     | 7s   | 8s     | 0s         | Calming technique to reduce anxiety and help with sleep         |
| Box Breathing   | 4s     | 4s   | 4s     | 4s         | Used by Navy SEALs to stay calm under pressure                  |
| Simple Calm     | 4s     | 0s   | 6s     | 0s         | Extended exhale activates parasympathetic nervous system        |

**Meditation Timer Presets:** 2 min, 5 min, 10 min, 15 min, 20 min  
**Source File:** `src/app/wellness/page.tsx`

---

## 8. 5-4-3-2-1 Grounding Exercise

Step-by-step sensory grounding technique:

| Step | Count | Sense | Icon         | Prompt                                     |
|------|-------|-------|--------------|--------------------------------------------|
| 1    | 5     | See   | visibility   | Name 5 things you can see right now        |
| 2    | 4     | Touch | touch_app    | Name 4 things you can physically feel      |
| 3    | 3     | Hear  | hearing      | Name 3 things you can hear                 |
| 4    | 2     | Smell | air          | Name 2 things you can smell                |
| 5    | 1     | Taste | restaurant   | Name 1 thing you can taste                 |

**Source File:** `src/app/wellness/page.tsx`

---

## 9. Wellness Resource Library

Curated mental health articles and guides:

| Title                   | Category | Description                                                            | Icon        |
|-------------------------|----------|------------------------------------------------------------------------|-------------|
| Understanding Anxiety   | Article  | Causes, symptoms, and evidence-based coping strategies                 | psychology  |
| Mindful Eating Guide    | Guide    | Using meals as a mindfulness practice for emotional wellbeing          | restaurant  |
| Sleep Hygiene 101       | Article  | Building a bedtime routine for better sleep                            | bedtime     |
| Coping with Grief       | Guide    | Navigating loss and finding meaning through healing                    | favorite    |

**Source File:** `src/app/wellness/page.tsx`

---

## 10. Emergency Contacts

Default emergency contacts dataset:

| Contact      | Phone        | Notes                                    |
|--------------|--------------|------------------------------------------|
| Mom          | +1-555-0101  | Default emergency contact                |
| Best Friend  | +1-555-0102  | Default emergency contact                |

**Crisis Hotline:** 988 (Suicide & Crisis Lifeline)  
**Features:** Geolocation sharing, 3-second countdown activation, quick exit to Google  
**Source Files:** `src/app/emergency/page.tsx`, `src/app/profile/page.tsx`

---

## 11. User Profile

Default user profile data:

| Field | Default Value                  |
|-------|--------------------------------|
| Name  | Alex Johnson                   |
| Email | alex@example.com               |
| Bio   | Taking one day at a time.      |

**Source File:** `src/app/profile/page.tsx`

---

## 12. User Preferences

Configurable preference toggles:

| Preference                | Description                                              | Default |
|---------------------------|----------------------------------------------------------|---------|
| Daily journal reminders   | Notification each evening to log thoughts                | ✅ On   |
| Weekly mood reports       | Summary of mood trends each Sunday                       | ✅ On   |
| Community notifications   | Notified when someone replies to your posts              | ❌ Off  |
| Sound effects             | Sounds during breathing and meditation exercises          | ✅ On   |

**Source File:** `src/app/profile/page.tsx`

---

## 13. Navigation & Feature Map

Application navigation structure:

| Route        | Feature                | Description                                             |
|--------------|------------------------|---------------------------------------------------------|
| `/`          | Home / Landing         | Hero section, features grid, mood preview               |
| `/chat`      | AI Therapy             | Real-time AI chatbot with 3 personas, voice I/O         |
| `/log`       | Daily Thoughts Log     | Mood tracking, journaling, mood trend visualization     |
| `/doctors`   | Find a Doctor          | Doctor directory with booking system                    |
| `/community` | Community Forum        | Peer support forum with categories and moderation       |
| `/wellness`  | Wellness Hub           | Breathing exercises, grounding, meditation, resources   |
| `/emergency` | Emergency SOS          | Crisis hotline, location sharing, emergency contacts    |
| `/profile`   | User Profile           | Settings, emergency contacts, preferences, privacy      |

---

## 14. Browser APIs

Web APIs utilized for enhanced functionality:

| API                    | Purpose                                    | Fallback Behavior                       |
|------------------------|--------------------------------------------|-----------------------------------------|
| Web Speech API (STT)   | Speech-to-text for voice chat input        | Text input only                         |
| Web Speech API (TTS)   | Text-to-speech for AI responses            | Text-only responses                     |
| Geolocation API        | Location sharing in emergency mode         | Manual location sharing prompt          |
| LocalStorage           | Client-side state persistence              | In-memory state (session only)          |

---

## Data Storage Notes

- **No external database** is used — all data is stored in **React state** (client-side, in-memory)
- Data **resets on page refresh** (no persistence layer)
- **`.env.local`** stores the Groq API key securely (excluded from Git)
- Journal entries, mood logs, and chat history are **private and ephemeral**
- Community posts and doctor data are **hardcoded sample data** for demonstration

---

*Last updated: May 5, 2026*
