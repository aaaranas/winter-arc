import type { ExerciseGuide } from './types';

/** Trunk work: flexion, anti-rotation, anti-extension and the plank family. */
export const CORE_GUIDES: Record<string, ExerciseGuide> = {
  'side-plank': {
    setup: 'On one side, forearm under the shoulder, legs stacked, hips lifted off the floor.',
    steps: ['Hold a straight line from head to heels for the target time.', 'Swap sides.'],
    cues: ['Do not let the top hip roll forward or the bottom hip sag.'],
  },
  'side-plank-hip-dip': {
    setup: 'A side plank position, hips lifted.',
    steps: ['Lower the hips toward the floor without touching.', 'Lift back to the straight-line position.'],
  },
  'copenhagen-plank': {
    setup: 'On one side with the top leg resting on a bench and the bottom leg hanging free.',
    steps: ['Lift the hips using the top inner thigh until the body is straight.', 'Hold or lower under control.'],
    cues: ['Very demanding on the adductors. Start with the knee on the bench rather than the ankle.'],
  },
  'bear-plank': {
    setup: 'On hands and knees with the knees an inch off the floor, back flat.',
    steps: ['Hold, keeping the back flat and the knees hovering.'],
    cues: ['If the lower back arches, the hips are too low.'],
  },
  'bear-crawl': {
    setup: 'A bear plank position, knees hovering.',
    steps: ['Crawl forward moving opposite hand and foot together, keeping the hips low and level.'],
    cues: ['Keep the hips from swaying side to side — that is the core work.'],
  },
  'plank-shoulder-tap': {
    setup: 'A high plank position with the hands under the shoulders, feet slightly wide.',
    steps: ['Lift one hand and tap the opposite shoulder.', 'Replace it and alternate.'],
    cues: ['Widen the feet if the hips rotate. Resisting that rotation is the point.'],
  },
  'push-up-shoulder-tap': {
    setup: 'A high plank position.',
    steps: ['Perform a push-up, then at the top tap each shoulder in turn.'],
  },
  'plank-jack': {
    setup: 'A forearm or high plank position, feet together.',
    steps: ['Jump the feet out wide, then back together, keeping the hips level.'],
    cues: ['The hips should not bounce up and down as the feet move.'],
  },
  inchworm: {
    setup: 'Standing tall, feet hip width.',
    steps: [
      'Hinge and place the hands on the floor.',
      'Walk the hands out to a high plank.',
      'Walk the feet up to the hands and stand.',
    ],
    cues: ['Keep the legs as straight as your hamstrings allow.'],
  },
  'ab-wheel': {
    setup: 'Kneeling with the wheel under the shoulders, core braced and pelvis tucked.',
    steps: [
      'Roll the wheel forward, extending the body while keeping the lower back from arching.',
      'Go only as far as you can hold that position, then pull back with the abs.',
    ],
    cues: [
      'The moment the lower back arches, you have gone too far. Shorten the range.',
      'Squeeze the glutes throughout to protect the spine.',
    ],
  },
  crunch: {
    setup: 'On your back, knees bent, feet flat, hands by the ears or across the chest.',
    steps: ['Curl the shoulder blades off the floor by flexing the spine.', 'Lower under control.'],
    cues: ['Small range. Do not yank on the neck.'],
  },
  'weighted-crunch': {
    setup: 'A crunch position with a plate held on the chest.',
    steps: ['Curl the shoulder blades off the floor.', 'Lower under control.'],
  },
  'reverse-crunch': {
    setup: 'On your back with the knees bent over the hips, hands by your sides.',
    steps: ['Curl the pelvis up off the floor, bringing the knees toward the chest.', 'Lower under control.'],
    cues: ['The lift comes from curling the pelvis, not from swinging the legs.'],
  },
  'decline-sit-up': {
    setup: 'Feet secured on a decline bench, torso lying back.',
    steps: ['Sit up by curling the spine.', 'Lower under control rather than dropping.'],
  },
  'bicycle-crunch': {
    setup: 'On your back, hands by the ears, knees bent over the hips.',
    steps: [
      'Bring one elbow toward the opposite knee while extending the other leg.',
      'Alternate in a steady pedalling rhythm.',
    ],
    cues: ['Slow beats fast here. Rotate the torso rather than pulling on the neck.'],
  },
  'russian-twist': {
    setup: 'Seated, leaning back to about 45°, feet on or just off the floor.',
    steps: ['Rotate the torso to one side, then the other.'],
    cues: ['Rotate the shoulders and ribcage, not just the arms.'],
  },
  'weighted-russian-twist': {
    setup: 'A russian twist position holding a plate or dumbbell at the chest.',
    steps: ['Rotate the torso side to side under control.'],
  },
  'v-up': {
    setup: 'Lying flat with the arms extended overhead and legs straight.',
    steps: ['Lift the arms and legs at the same time to meet over the hips.', 'Lower under control.'],
    cues: ['Keep the lower back from arching as the legs return.'],
  },
  'toe-touch': {
    setup: 'On your back with the legs straight up toward the ceiling.',
    steps: ['Curl the shoulder blades up and reach for the toes.', 'Lower under control.'],
  },
  'heel-tap': {
    setup: 'On your back with the knees bent, feet flat, shoulders slightly off the floor.',
    steps: ['Reach one hand to tap the same-side heel.', 'Alternate side to side.'],
  },
  'flutter-kick': {
    setup: 'On your back, legs straight, hands under the glutes, lower back pressed down.',
    steps: ['Alternate small, quick up-and-down kicks with straight legs.'],
    cues: ['If the lower back lifts, raise the legs higher.'],
  },
  'lying-leg-raise': {
    setup: 'On your back, legs straight, hands under the glutes for support.',
    steps: ['Raise the legs to vertical, keeping them straight.', 'Lower under control without touching down.'],
    cues: ['Keep the lower back pressed into the floor the whole way.'],
  },
  'hollow-body-hold': {
    setup: 'On your back, lower back pressed flat, arms overhead and legs extended.',
    steps: ['Lift the arms, head and legs so only the lower back touches the floor.', 'Hold for the target time.'],
    cues: ['If the lower back lifts, bring the arms and legs closer in until it stays down.'],
  },
  'hollow-rock': {
    setup: 'A hollow body position.',
    steps: ['Rock back and forth as one rigid piece, keeping the hollow shape.'],
    cues: ['The rock comes from the shoulders, not from breaking at the hips.'],
  },
  'seated-knee-tuck': {
    setup: 'Seated on the floor or a bench, leaning back on the hands, legs extended.',
    steps: ['Pull the knees toward the chest.', 'Extend back out without letting the feet touch down.'],
  },
  'hanging-knee-raise': {
    setup: 'Hanging from a bar with the shoulders active.',
    steps: ['Raise the knees toward the chest, curling the pelvis at the top.', 'Lower under control.'],
    cues: ['If you swing, pause at the bottom before the next rep.'],
  },
  'captains-chair-knee-raise': {
    setup: 'Forearms on the pads of a captain’s chair, back against the pad, legs hanging.',
    steps: ['Raise the knees toward the chest.', 'Lower under control.'],
  },
  'l-sit-hold': {
    setup: 'Supported on parallettes, dip bars or the floor, arms locked and shoulders pressed down.',
    steps: ['Lift the legs straight out in front to hip height and hold.'],
    cues: ['Start with tucked knees and straighten the legs as it gets easier.'],
  },
  'dragon-flag': {
    setup: 'Lying on a bench gripping it behind your head, body straight.',
    steps: [
      'Drive the legs up until the body is nearly vertical, resting on the upper back.',
      'Lower the whole body as one rigid line, as slowly as possible.',
    ],
    cues: ['Advanced. Bend the knees to shorten the lever until you can hold the line.'],
  },
  'dumbbell-side-bend': {
    setup: 'Standing tall with a dumbbell in one hand, the other hand on the hip.',
    steps: ['Bend sideways toward the weighted side.', 'Return to upright, then swap sides.'],
    cues: ['Bend straight sideways — no twisting or leaning forward.'],
  },
  'dead-bug': {
    setup: 'On your back with the arms straight up and the knees bent over the hips, lower back flat.',
    steps: [
      'Lower one arm overhead and the opposite leg toward the floor.',
      'Return and alternate, keeping the lower back pressed down.',
    ],
    cues: ['The moment the lower back lifts, shorten the range. That contact is the whole exercise.'],
  },
  'banded-dead-bug': {
    setup: 'A dead bug position with a band anchored overhead and held in both hands.',
    steps: ['Press against the band while lowering the opposite leg.', 'Return and alternate.'],
  },
  'bird-dog': {
    setup: 'On all fours, hands under the shoulders, knees under the hips, back flat.',
    steps: [
      'Extend one arm forward and the opposite leg back until both are in line with the torso.',
      'Return under control and alternate.',
    ],
    cues: ['The hips stay square and level — a glass of water on your back should not spill.'],
  },
  'pallof-press': {
    setup: 'Standing side-on to a cable at chest height, both hands on the handle at the sternum.',
    steps: [
      'Press the handle straight out in front of the chest, resisting the pull toward the machine.',
      'Return to the chest without letting the torso rotate.',
    ],
    cues: ['This is anti-rotation — success is the torso not moving at all.'],
  },
  'half-kneeling-pallof-press': {
    setup: 'Half kneeling side-on to the cable, handle at the sternum.',
    steps: ['Press the handle out and back without rotating.'],
    cues: ['The kneeling stance stops you cheating with the legs.'],
  },
  'cable-pallof-hold': {
    setup: 'Side-on to the cable with the handle pressed out at arm’s length.',
    steps: ['Hold the extended position for the target time without rotating.'],
  },
  'banded-pallof-press': {
    setup: 'Side-on to a band anchored at chest height, handle at the sternum.',
    steps: ['Press out and return without rotating.'],
  },
  'cable-woodchop': {
    setup: 'Side-on to a cable set high, both hands on the handle.',
    steps: [
      'Pull the handle down and across the body to the opposite hip, rotating the torso.',
      'Return under control, then swap sides.',
    ],
    cues: ['Rotate through the ribcage and let the back foot pivot — do not twist the lower back alone.'],
  },
  'banded-woodchop': {
    setup: 'Side-on to a band anchored high, both hands on it.',
    steps: ['Pull down and across to the opposite hip.', 'Return under control.'],
  },
  'mountain-climber': {
    setup: 'A high plank with the hands under the shoulders.',
    steps: ['Drive one knee toward the chest, then switch legs quickly.'],
    cues: ['Keep the hips low and level — they want to bounce up with speed.'],
  },
  'half-burpee': {
    setup: 'A high plank position.',
    steps: ['Jump both feet forward toward the hands.', 'Jump them back to the plank.'],
    cues: ['A burpee without the push-up or the stand — keeps the pace high.'],
  },
  'squat-thrust': {
    setup: 'Standing tall.',
    steps: [
      'Drop the hands to the floor and jump the feet back to a plank.',
      'Jump the feet back in and stand up.',
    ],
    cues: ['Like a burpee without the jump at the top.'],
  },
};
