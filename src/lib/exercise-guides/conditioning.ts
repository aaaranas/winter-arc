import type { ExerciseGuide } from './types';

/** Cardio, plyometrics and mobility work. */
export const CONDITIONING_GUIDES: Record<string, ExerciseGuide> = {
  // ----------------------------------------------------------------- cardio
  running: {
    setup: 'Standing tall, shoulders relaxed, eyes up the road.',
    steps: [
      'Run at a pace you can sustain for the target distance or time.',
      'Land with the foot under the hips rather than reaching out in front.',
    ],
    cues: [
      'Increase weekly distance gradually — most running injuries come from adding too much too fast.',
    ],
  },
  walking: {
    setup: 'Standing tall, relaxed posture.',
    steps: ['Walk at a steady pace for the target time or distance.'],
    cues: ['The most underrated conditioning tool, and it barely costs recovery.'],
  },
  hiking: {
    setup: 'Appropriate footwear, pack fitted close to the back.',
    steps: ['Walk the route at a sustainable pace, shortening your stride on the climbs.'],
    cues: ['Descents are harder on the legs than climbs — pace those too.'],
  },
  cycling: {
    setup: 'Saddle height so the knee stays slightly bent at the bottom of the stroke.',
    steps: ['Ride at a steady effort for the target time or distance.'],
    cues: ['Spin at a comfortable cadence rather than grinding a heavy gear.'],
  },
  'stair-climber': {
    setup: 'Standing tall on the machine, hands resting lightly on the rails.',
    steps: ['Climb at a steady pace for the target time.'],
    cues: ['Do not hang off the handrails — that removes most of the work.'],
  },
  elliptical: {
    setup: 'Feet flat on the pedals, upright posture.',
    steps: ['Work at a steady effort for the target time.'],
  },
  'assault-bike': {
    setup: 'Seated with the saddle at hip height, hands on the moving handles.',
    steps: ['Drive with the arms and legs together for the target time or calories.'],
    cues: ['The resistance rises with your effort, so it punishes going out too hard.'],
  },
  'treadmill-incline-walk': {
    setup: 'Treadmill set to a steep incline, walking pace.',
    steps: ['Walk without holding the handrails for the target time.'],
    cues: ['Holding on drops the effort enormously. Lower the incline instead.'],
  },

  // ------------------------------------------------------------ plyometrics
  burpee: {
    setup: 'Standing tall, feet shoulder width.',
    steps: [
      'Drop the hands to the floor and jump the feet back to a plank.',
      'Lower the chest to the floor.',
      'Press up and jump the feet back in.',
      'Jump up with the hands overhead.',
    ],
    cues: ['Keep the core braced so the lower back does not sag on the way down.'],
  },
  'high-knees': {
    setup: 'Standing tall, core braced.',
    steps: ['Run in place, driving each knee up to hip height.'],
    cues: ['Stay on the balls of the feet and keep the torso upright.'],
  },
  'jumping-jack': {
    setup: 'Standing with the feet together and arms at your sides.',
    steps: ['Jump the feet wide while raising the arms overhead.', 'Jump back to the start.'],
  },
  'skater-hop': {
    setup: 'Standing on one leg, knee softly bent.',
    steps: [
      'Bound sideways onto the other foot, letting the trailing leg swing behind.',
      'Stick the landing briefly, then bound back.',
    ],
    cues: ['Land softly and under control — this is a lateral strength drill, not a race.'],
  },
  'lateral-shuffle': {
    setup: 'An athletic stance, knees bent, weight on the balls of the feet.',
    steps: ['Shuffle sideways without letting the feet cross or click together.', 'Change direction on the whistle or at the marker.'],
    cues: ['Stay low the whole time — standing up is the usual fatigue tell.'],
  },
  sprawl: {
    setup: 'An athletic stance.',
    steps: [
      'Drop the hands to the floor and kick the legs back, letting the hips fall to the floor.',
      'Push back up and return to the stance.',
    ],
    cues: ['A burpee variant from wrestling — the hips reaching the floor is the point.'],
  },

  // --------------------------------------------------------------- mobility
  'cat-cow-stretch': {
    setup: 'On all fours, hands under the shoulders and knees under the hips.',
    steps: [
      'Round the spine upward and tuck the chin.',
      'Then reverse: drop the belly, lift the chest and tailbone.',
      'Move slowly between the two.',
    ],
    cues: ['Move with the breath rather than forcing the range.'],
  },
  'worlds-greatest-stretch': {
    setup: 'A deep lunge with the front foot flat and the hands on the floor inside it.',
    steps: [
      'Drop the back knee or keep it lifted, then place the inside elbow toward the floor.',
      'Rotate the torso open, reaching the inside arm to the ceiling.',
      'Return and swap sides.',
    ],
    cues: ['Covers hips, thoracic spine and hamstrings in one — a good warm-up staple.'],
  },
  'leg-swings-stretch': {
    setup: 'Standing tall, holding a wall or rack for balance.',
    steps: ['Swing one leg forward and back in a controlled arc.', 'Then swing it side to side. Swap legs.'],
    cues: ['Build the range gradually rather than throwing the leg to its end range cold.'],
  },
  'torso-twist-stretch': {
    setup: 'Standing with the feet shoulder width, arms relaxed.',
    steps: ['Rotate the torso side to side, letting the arms swing loosely.'],
    cues: ['Keep the hips fairly still so the rotation happens through the upper back.'],
  },
};
