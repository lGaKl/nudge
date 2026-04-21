# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository status

Ce repo est **pré-bootstrap**. Il ne contient pas encore de code applicatif : seulement `.claude/skills/` (les deux skills produit+bootstrap) et `.idea/` (config WebStorm). L'app Expo `nudge` sera créée via le skill `nudge-bootstrap` (tâche T01). Tant que T01 n'est pas jouée, il n'y a ni `package.json`, ni scripts, ni dépendances installables.

## Source de vérité : les skills

Les deux skills dans `.claude/skills/` sont **la boussole du projet**. Avant toute action, lis-les :

- **`.claude/skills/nudge-project/SKILL.md`** — produit, principes non-négociables, scope MVP figé, modèle de données, stack, roadmap T01–T12 avec sous-tâches estimées. À invoquer (`/nudge-project`) dès qu'une demande concerne le produit, une feature, le scope, la stack, ou "où en suis-je".
- **`.claude/skills/nudge-bootstrap/SKILL.md`** — séquence exacte de commandes pour initialiser le projet (T01). À invoquer (`/nudge-bootstrap`) **une seule fois**, au premier démarrage.

En cas de conflit entre ce fichier et un skill, le skill gagne (il est plus détaillé et plus à jour).

## Ce que Nudge est

App mobile TDAH-first (iOS/Android via Expo) qui décompose les tâches du quotidien en micro-étapes guidées, plein écran, sans jugement. **Local-first, sans compte, sans backend.** Utilisateur cible MVP : TDAH adulte francophone (le créateur lui-même).

## Principes à ne jamais négocier sans alerte explicite

1. **Shame-free** : pas de rouge, pas de compteur de ratés, pas de "tu n'as pas fait…". Une tâche non faite disparaît.
2. **Local-first** : SQLite sur l'appareil, backup natif iCloud/Drive, pas d'auth, pas de backend.
3. **Un seul concept : la Task.** Une routine = une Task avec `recurrence`. Jamais deux onglets "routines" vs "tâches".
4. **Pas de LLM runtime pour générer des décompositions.** Templates écrits à la main.
5. **Motivation concrète + permission d'arrêter** sur chaque tâche (champ `outcome` sensoriel + phrase "tu peux t'arrêter après celle-ci").
6. **Une étape à la fois, plein écran** en mode focus.
7. **Créer une tâche = 3 champs max.** Pas de formulaire long.

Si une demande utilisateur heurte un de ces principes, **challenge avant d'exécuter** — l'utilisateur a explicitement demandé à être challengé plutôt que servi en yes-man.

## Stack figée (ne pas dévier sans accord explicite)

Expo SDK récent · expo-router · TypeScript strict (`noUncheckedIndexedAccess`) · **NativeWind v4** (pas v5) · Drizzle ORM · expo-sqlite · Zustand · expo-notifications · expo-linking · pnpm · WebStorm.

Explicitement **hors stack** : Redux, Context global, Nx/monorepo, NestJS, OAuth, backend quelconque, IA de décomposition.

## Hors scope MVP à rappeler si proposé

Backend/auth/sync, partage aidant, IA de décomposition, Spotify via API (on reste sur deep link `spotify:search:…`), gamification, stats, mode TSA, widgets, Apple Watch.

## Modèle de données (figé)

Un seul concept `Task` avec `Step[]`, `Recurrence | null`, `outcome`, `musicQuery?`, `archivedAt` (soft delete). Une `TaskInstance` par occurrence d'une tâche récurrente (`completedSteps`, `completedAt | null`, `skippedAt | null`). **Pas de statut "échoué".** Voir le skill produit pour le schéma exact.

## Roadmap

12 tâches ordonnées T01–T12 (~28–35 h de travail). Chaque tâche finie = `git commit` + `git tag milestone-TNN`. Règle d'or : **ne jamais démarrer la tâche suivante sans avoir fini la précédente**. Voir le skill produit pour la liste détaillée avec sous-tâches.

## Commandes

Pas encore applicables (pré-bootstrap). Après T01 elles vivront dans le `package.json` de `nudge/` : `pnpm start`, `pnpm ios`, `pnpm android`, `pnpm typecheck`, `pnpm doctor`, `pnpm db:generate`, `pnpm db:studio`. À ce moment-là, mettre à jour ce fichier.

## Limites de Claude dans ce projet

Claude **ne peut pas** exécuter `pnpm create expo-app` ni les builds natifs sur la machine de l'utilisateur (pas d'accès à son shell). Pour le bootstrap et les commandes Expo, livrer les commandes bloc par bloc et attendre confirmation, pas les enchaîner.

## Ton

Direct, bienveillant, un peu provocateur quand un principe est menacé. Ramène systématiquement à l'**action concrète suivante** (la prochaine sous-tâche non commencée), pas à une réflexion de plus — l'utilisateur a un TDAH, la réflexion infinie est le plus gros risque du projet.
