# ui-todo ![test-backend](https://github.com/albin-rohde/ui-todo/actions/workflows/test-backend.yml/badge.svg) ![lint-backend](https://github.com/albin-rohde/ui-todo/actions/workflows/lint-backend.yml/badge.svg) ![lint-frontend](https://github.com/albin-rohde/ui-todo/actions/workflows/lint-frontend.yml/badge.svg)

## Stories completed

Stories with a checkmark is completed.

- [x] ⚠ (required): I as a user can create to-do items, such as a grocery list
- [x] ⚠ (required): I as another user can collaborate in real-time with user - so that
  we can (for example) edit our family shopping-list together
- [x] I as a user can mark to-do items as “done” - so that I can avoid clutter and focus
  on things that are still pending
- [x] I as a user can filter the to-do list and view items that were marked as done - so
  that I can retrospect on my prior progress
- [x] I as a user can add sub-tasks to my to-do items - so that I could make logical
  groups of tasks and see their overall progress
- [ ] I as a user can specify cost/price for a task or a subtask - so that I can track
  my expenses / project cost
- [x] I as a user can see the sum of the subtasks aggregated in the parent task - so
  that in my shopping list I can see what contributes to the overall sum. For example I
  can have a task “Salad”, where I'd add all ingredients as sub-tasks, and would see how
  much does salad cost on my shopping list
- [x] I as a user can make infinite nested levels of subtasks
- [ ] I as a user can add sub-descriptions of tasks in Markdown and view them as rich
  text
  while I'm not editing the descriptions
- [x] I as a user can see the cursor and/or selection of another-user as he
  selects/types when he is editing text - so that we can discuss focused words during
  our online call.
- [x] I as a user can create multiple to-do lists where each list has it's unique URL
  that I can share with my friends - so that I could have separate to do lists for my
  groceries and work related tasks
- [ ] In addition to regular to-do tasks, I as a user can add “special” typed to-do
  items, that will have custom style and some required fields:
  - [ ] ”work-task”, which has a required field “deadline” - which is a date
  - [ ] “food” that has fields:
    - [ ] required: “carbohydrate”, “fat”, “protein” (each specified in g/100g)
    - [ ] optional: “picture” an URL to an image used to render this item
- [ ] I as a user can keep editing the list even when I lose internet connection, and
  can expect it to sync up with BE as I regain connection
- [ ] I as a user can use my VR goggles to edit/browse multiple to-do lists in parallel
  in 3D space so that I can feel ultra-productive
- [ ] I as a user can change the order of tasks via drag & drop
- [ ] I as a user can move/convert subtasks to tasks via drag & drop
- [x] I as a user can be sure that my todos will be persisted so that important
  information is not lost when server restarts
- [x] I as an owner/creator of a certain to-do list can freeze/unfreeze a to-do list
  I've created to avoid other users from mutating it

### Bonus story

- [x] I as an owner/creator of a certain to-do list can make a list private, so that
  only i can view it
- [x] I as a user want to have a good experience visiting the app on mobile

---
## Running the app in production

Easiest is to use docker-compose:

```bash
docker-compose up
```

This will start the app on port 4000.
A full example of how a docker-compose file could look like can be
found [here](./docker-compose.yml).

---
## Running app for development

### Pre-requisites

- Node.js v18
- npm
- docker

### Start background services

```bash
docker-compose up -d redis db
```

### Backend

```bash
cd backend
npm install
npm run dev
```

This will start the backend on port 5000.

### Frontend

```bash
cd frontend
npm install
npm start
```

This will start the frontend on port 3000.

---

## Running app standalone to this repo

```yaml
version: "3"

networks:
  local:
    driver: bridge

services:
  ubi-todo:
    image: ghcr.io/albin-rohde/ui-todo:latest
    container_name: ubi-todo.app
    expose:
      - 5000
    networks:
      - proxy
    restart: unless-stopped
    depends_on:
      - ubi-todo.db
      - ubi-todo.redis
    environment:
      - POSTGRES_USER=
      - POSTGRES_PASSWORD=
      - POSTGRES_DB=$
      - POSTGRES_PORT=5432
      - POSTGRES_HOST=ubi-todo.db
      - REDIS_URL=redis://ubi-todo.redis:6379
      - PORT=5000

  ubi-todo.db:
    image: postgres
    container_name: ubi-todo.db
    expose:
      - 5432
    networks:
      - proxy
    restart: unless-stopped
    environment:
      - POSTGRES_USER=
      - POSTGRES_PASSWORD=
      - POSTGRES_DB=

  ubi-todo.redis:
    image: redis:latest
    container_name: ubi-todo.redis
    expose:
      - 6379
    networks:
      - proxy
    restart: unless-stopped
    environment:
      - REDIS_REPLICATION_MODE=master
```