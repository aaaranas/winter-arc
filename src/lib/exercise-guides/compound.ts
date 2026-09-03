import type { ExerciseGuide } from './types';

/**
 * The 48 compound and accessory lifts used by the built-in routines.
 * See ./types.ts for where this text comes from and what it is not.
 */
export const COMPOUND_GUIDES: Record<string, ExerciseGuide> = {
  // ---------------------------------------------------------------- press
  'bench-press': {
    setup:
      'Lie on the bench with eyes under the bar. Feet flat, slight arch in the lower back, shoulder blades pulled together and down.',
    steps: [
      'Grip the bar slightly wider than shoulder width and unrack it to over your shoulders.',
      'Lower under control to the lower chest, elbows tucked to roughly 45° from your torso.',
      'Touch the chest without bouncing, then press back up and slightly back toward the shoulders.',
      'Lock out without letting the shoulder blades come apart.',
    ],
    cues: [
      'Keep the shoulder blades retracted the whole set — that is what protects the shoulder.',
      'Wrists stacked over the elbows, not bent back.',
      'Use a spotter or safeties when working near failure.',
    ],
  },
  'incline-bench-press': {
    setup: 'Set the bench to 30–45°. Same setup as flat bench: feet down, blades retracted.',
    steps: [
      'Unrack and bring the bar over the upper chest.',
      'Lower to just below the collarbone.',
      'Press up and slightly back, keeping elbows about 45°.',
    ],
    cues: ['Steeper than 45° turns this into a shoulder press.'],
  },
  'incline-dumbbell-press': {
    setup: 'Bench at 30–45°. Dumbbells on your thighs, then kick them up as you lie back.',
    steps: [
      'Start with the dumbbells at the outside of the upper chest.',
      'Press up and slightly inward until they nearly touch.',
      'Lower under control until you feel a stretch across the chest.',
    ],
    cues: ['Do not clash the dumbbells at the top — it kills the tension.'],
  },
  'close-grip-bench-press': {
    setup: 'Bench press setup, hands about shoulder width. Not narrower — that strains the wrists.',
    steps: [
      'Unrack and lower the bar to the lower chest with elbows tucked close to the body.',
      'Press back up, driving through the triceps.',
    ],
    cues: ['Elbows stay tucked. Flaring turns it back into a chest press.'],
  },
  'overhead-press': {
    setup:
      'Bar on the front rack at collarbone height, hands just outside shoulders, feet hip width.',
    steps: [
      'Brace the core and squeeze the glutes so the ribs stay down.',
      'Press the bar straight up, moving your head back slightly out of the path.',
      'As the bar clears your forehead, push your head back through so it finishes over the mid-foot.',
      'Lower under control to the collarbone.',
    ],
    cues: [
      'No leaning back — the ribcage stays stacked over the pelvis.',
      'Squeeze the glutes to stop the lower back arching.',
    ],
  },
  'seated-dumbbell-press': {
    setup: 'Upright bench, dumbbells at shoulder height, palms forward, back supported.',
    steps: [
      'Press both dumbbells overhead until the arms are nearly locked.',
      'Lower under control until the elbows are level with the shoulders.',
    ],
    cues: ['Stop the descent at shoulder level; going lower stresses the joint for no gain.'],
  },
  'arnold-press': {
    setup: 'Seated, dumbbells at chest height, palms facing you, elbows in.',
    steps: [
      'Press up while rotating the palms to face forward.',
      'Finish overhead with arms nearly locked.',
      'Reverse the rotation on the way down until palms face you again.',
    ],
    cues: ['Rotate smoothly through the press, not all at once at the top.'],
  },
  'chest-dip': {
    setup: 'Support yourself on parallel bars, arms locked, shoulders down away from the ears.',
    steps: [
      'Lean the torso forward about 30° and let the elbows flare slightly.',
      'Lower until the upper arms are roughly parallel to the floor.',
      'Press back up, keeping the forward lean.',
    ],
    cues: ['Forward lean targets the chest; staying upright targets triceps.', 'Do not sink below a comfortable shoulder stretch.'],
  },

  // ---------------------------------------------------------------- chest isolation
  'cable-fly': {
    setup: 'Pulleys set high or mid, one handle in each hand, split stance, slight forward lean.',
    steps: [
      'Start with arms out wide, elbows softly bent and fixed.',
      'Bring the hands together in an arc in front of the chest.',
      'Squeeze, then let the arms open back out under control.',
    ],
    cues: ['The elbow angle never changes — it is a fly, not a press.'],
  },
  'dumbbell-fly': {
    setup: 'Flat bench, dumbbells pressed over the chest, palms facing each other, elbows soft.',
    steps: [
      'Open the arms out in a wide arc until you feel a stretch across the chest.',
      'Bring them back together over the chest along the same arc.',
    ],
    cues: ['Go lighter than you think. Depth of stretch matters more than load.'],
  },
  'pec-deck': {
    setup: 'Seat height so the handles sit at chest level. Back flat against the pad.',
    steps: [
      'Bring the handles together in front of the chest.',
      'Pause and squeeze, then return under control until you feel a stretch.',
    ],
  },

  // ---------------------------------------------------------------- back
  'pull-up': {
    setup: 'Hang from the bar with an overhand grip, hands slightly wider than shoulders.',
    steps: [
      'Start from a dead hang, then pull the shoulder blades down and back.',
      'Drive the elbows down toward your ribs until the chin clears the bar.',
      'Lower all the way back to a full hang under control.',
    ],
    cues: [
      'Think "pull the elbows to the floor", not "pull the chin up".',
      'Full range each rep — half reps mostly train the grip.',
    ],
  },
  'weighted-pull-up': {
    setup: 'As a pull-up, with a dip belt or a dumbbell between the feet.',
    steps: [
      'Dead hang, shoulder blades down, then pull until the chin clears the bar.',
      'Lower under control — resist the extra weight rather than dropping.',
    ],
    cues: ['Add weight only once you can do clean bodyweight reps for the target.'],
  },
  'lat-pulldown': {
    setup: 'Thighs locked under the pad, overhand grip slightly wider than shoulders.',
    steps: [
      'Start with the arms extended and the shoulders allowed to rise.',
      'Pull the shoulder blades down first, then bring the bar to the upper chest.',
      'Return under control, letting the lats stretch at the top.',
    ],
    cues: ['Lean back slightly and hold that angle — do not row by swinging.'],
  },
  'close-grip-lat-pulldown': {
    setup: 'Same as lat pulldown but with a narrow neutral (V) handle.',
    steps: [
      'Pull the handle to the lower chest, elbows driving straight down.',
      'Return to a full stretch.',
    ],
    cues: ['The narrow grip lets the elbows travel further back — use that range.'],
  },
  'barbell-row': {
    setup:
      'Bar over mid-foot, hinge at the hips until the torso is around 45°, back flat, knees soft.',
    steps: [
      'Grip just outside the knees and brace the core hard.',
      'Row the bar to the lower ribs or upper stomach.',
      'Lower under control without letting the back round.',
    ],
    cues: [
      'The torso angle stays fixed for the whole set. If it rises, the weight is too heavy.',
      'Lead with the elbows, not the hands.',
    ],
  },
  'seated-row': {
    setup: 'Feet on the platform, knees slightly bent, chest up, torso upright.',
    steps: [
      'Start with the arms extended and the lats stretched.',
      'Pull the handle to the stomach, driving the elbows back past the torso.',
      'Return under control to a full stretch.',
    ],
    cues: ['No rocking back and forth — the torso stays still.'],
  },
  'straight-arm-pulldown': {
    setup: 'Stand facing a high pulley, bar at shoulder height, arms almost straight, hinge slightly.',
    steps: [
      'Keeping the elbows locked in a soft bend, push the bar down in an arc to the thighs.',
      'Squeeze the lats, then let the bar return overhead under control.',
    ],
    cues: ['Elbow angle never changes — if it does, it becomes a pushdown.'],
  },
  'face-pull': {
    setup: 'Rope on a high pulley at face height, one end in each hand, palms facing in.',
    steps: [
      'Pull the rope toward the face, separating the hands as you go.',
      'Finish with the hands beside the ears and the elbows high.',
      'Return under control.',
    ],
    cues: ['Light weight, high reps. This is for the rear delts and upper back, not a max lift.'],
  },

  // ---------------------------------------------------------------- shoulders
  'lateral-raise': {
    setup: 'Stand with dumbbells at your sides, elbows very slightly bent, torso upright.',
    steps: [
      'Raise the arms out to the sides until they reach shoulder height.',
      'Lower slowly, resisting the whole way down.',
    ],
    cues: [
      'Lead with the elbows, not the hands.',
      'Stop at shoulder height — higher brings in the traps.',
      'If you are swinging, halve the weight.',
    ],
  },
  'cable-lateral-raise': {
    setup: 'Low pulley, handle in the hand furthest from the machine, cable crossing in front.',
    steps: [
      'Raise the arm out to the side to shoulder height.',
      'Lower under control against the constant cable tension.',
    ],
    cues: ['The cable keeps tension at the bottom, where dumbbells lose it.'],
  },
  'rear-delt-fly': {
    setup: 'Hinge forward to roughly 45°, dumbbells hanging under the chest, elbows soft.',
    steps: [
      'Raise the arms out to the sides in a wide arc until level with the torso.',
      'Squeeze the rear delts, then lower under control.',
    ],
    cues: ['Thumbs slightly down helps target the rear delt.', 'Do not turn it into a row.'],
  },

  // ---------------------------------------------------------------- arms
  'bicep-curl': {
    setup: 'Dumbbells at your sides, palms forward, elbows pinned to the ribs.',
    steps: [
      'Curl the weights up by bending the elbows only.',
      'Squeeze at the top, then lower slowly to full extension.',
    ],
    cues: ['Elbows stay put. Swinging the torso moves the work to the front delts.'],
  },
  'ez-bar-curl': {
    setup: 'EZ bar with hands on the angled grips, elbows at the sides.',
    steps: ['Curl the bar to shoulder height.', 'Lower under control to full extension.'],
    cues: ['The angled grip is easier on the wrists than a straight bar.'],
  },
  'cable-curl': {
    setup: 'Low pulley with a straight or EZ attachment, elbows at the sides.',
    steps: ['Curl to shoulder height.', 'Lower slowly against constant tension.'],
  },
  'hammer-curl': {
    setup: 'Dumbbells at your sides, palms facing each other (neutral grip).',
    steps: ['Curl straight up keeping the palms facing in.', 'Lower under control.'],
    cues: ['Targets the brachialis and forearm more than a supinated curl.'],
  },
  'incline-dumbbell-curl': {
    setup: 'Bench at about 60°, lie back, arms hanging straight down behind the torso.',
    steps: ['Curl the dumbbells up without letting the elbows drift forward.', 'Lower to a full stretch.'],
    cues: ['The stretched start position is the whole point — do not shorten it.'],
  },
  'concentration-curl': {
    setup: 'Seated, elbow braced against the inside of the thigh, arm hanging.',
    steps: ['Curl the dumbbell toward the shoulder.', 'Squeeze, then lower to full extension.'],
  },
  'tricep-pushdown': {
    setup: 'High pulley with a straight bar, elbows pinned at the sides, slight forward lean.',
    steps: [
      'Push the bar down until the arms are locked out.',
      'Return until the forearms are just past parallel.',
    ],
    cues: ['Only the forearms move. Elbows do not travel.'],
  },
  'rope-tricep-pushdown': {
    setup: 'High pulley with a rope, elbows at the sides.',
    steps: [
      'Push down and spread the rope ends apart at the bottom.',
      'Return under control.',
    ],
    cues: ['The spread at the bottom is what separates it from the bar version.'],
  },
  'overhead-tricep-extension': {
    setup: 'Rope on a low or high pulley, facing away, hands overhead, elbows beside the ears.',
    steps: [
      'Extend the arms overhead until locked.',
      'Lower until you feel a stretch along the back of the arm.',
    ],
    cues: ['Elbows stay narrow — they want to flare.'],
  },
  'skull-crusher': {
    setup: 'Lying on a bench, EZ bar pressed over the chest, arms vertical.',
    steps: [
      'Bend at the elbows to lower the bar toward the forehead or just behind it.',
      'Extend back to the start without letting the upper arms drift.',
    ],
    cues: ['Lowering behind the head keeps tension on the triceps at the top.'],
  },

  // ---------------------------------------------------------------- legs
  squat: {
    setup:
      'Bar on the upper back, feet shoulder width, toes turned slightly out, whole foot planted.',
    steps: [
      'Brace the core as if about to be punched, then unrack and step back.',
      'Break at the hips and knees together and descend until the hip crease passes the knee.',
      'Drive up through the mid-foot, hips and chest rising at the same rate.',
    ],
    cues: [
      'Knees track over the toes — let them travel forward, just not inward.',
      'If the hips shoot up first, the weight is too heavy.',
    ],
  },
  'front-squat': {
    setup: 'Bar across the front delts, elbows high, either a clean grip or crossed arms.',
    steps: [
      'Brace, unrack, step back into a shoulder-width stance.',
      'Descend with an upright torso until the hip crease passes the knee.',
      'Drive up, keeping the elbows high the whole way.',
    ],
    cues: ['Elbows dropping is what makes the bar roll forward.'],
  },
  deadlift: {
    setup:
      'Bar over the mid-foot, feet hip width, shins close. Hinge and grip just outside the knees.',
    steps: [
      'Drop the hips until the shins touch the bar, chest up, back flat, lats engaged.',
      'Take the slack out of the bar, then push the floor away.',
      'Once past the knees, drive the hips forward to lock out standing tall.',
      'Return by hinging the hips back first, then bending the knees.',
    ],
    cues: [
      'The bar stays in contact with the legs the whole way.',
      'Do not lean back at the top — lock out and stop.',
      'A rounding lower back means stop the set.',
    ],
  },
  'romanian-deadlift': {
    setup: 'Standing, bar at the hips, feet hip width, knees softly bent and staying that way.',
    steps: [
      'Push the hips backward, letting the bar slide down the thighs.',
      'Stop when you feel a strong hamstring stretch, usually around mid-shin.',
      'Drive the hips forward to return to standing.',
    ],
    cues: [
      'This is a hip hinge, not a squat — the knee angle barely changes.',
      'Range is set by your hamstrings, not by touching the floor.',
    ],
  },
  'leg-press': {
    setup: 'Feet shoulder width on the middle of the platform, back and hips flat against the pad.',
    steps: [
      'Release the safeties and lower the platform until the knees reach about 90°.',
      'Press back up without locking the knees hard at the top.',
    ],
    cues: ['Stop before the lower back lifts off the pad — that is your real depth.'],
  },
  'bulgarian-split-squat': {
    setup: 'Rear foot on a bench, front foot far enough forward to keep the shin near vertical.',
    steps: [
      'Lower straight down until the back knee is just off the floor.',
      'Drive up through the front heel.',
      'Finish all reps on one leg, then swap.',
    ],
    cues: ['Front foot too close makes it a quad-only knee grinder — step it out.'],
  },
  'walking-lunge': {
    setup: 'Dumbbells at your sides, standing tall, core braced.',
    steps: [
      'Step forward and lower until the back knee nearly touches the floor.',
      'Drive through the front heel to step directly into the next lunge.',
    ],
    cues: ['Torso stays upright; a long step targets glutes, a short step targets quads.'],
  },
  'leg-extension': {
    setup: 'Pad on the lower shins, knees aligned with the machine pivot, back against the seat.',
    steps: ['Extend the knees until the legs are straight.', 'Squeeze, then lower under control.'],
    cues: ['A pause at the top does more than extra weight here.'],
  },
  'leg-curl': {
    setup: 'Pad just above the heels, hips flat against the machine.',
    steps: ['Curl the heels toward the glutes as far as the machine allows.', 'Return under control.'],
    cues: ['Keep the hips down — lifting them shortens the range.'],
  },
  'lying-leg-curl': {
    setup: 'Face down, pad above the heels, hips pressed into the bench.',
    steps: ['Curl the heels toward the glutes.', 'Lower slowly to full extension.'],
    cues: ['Resist the urge to lift the hips at the top.'],
  },
  'seated-leg-curl': {
    setup: 'Seated with the pad above the heels and the thigh restraint locked down.',
    steps: ['Curl the heels back and under the seat.', 'Return under control.'],
    cues: ['The seated version trains the hamstrings in a more stretched position than lying.'],
  },
  'standing-calf-raise': {
    setup: 'Balls of the feet on the platform, heels hanging free, knees straight but not locked.',
    steps: [
      'Drop the heels below the platform for a full stretch.',
      'Rise onto the toes as high as possible and pause.',
      'Lower slowly.',
    ],
    cues: ['Straight knees target the gastrocnemius. Slow down — calves respond to time, not bounce.'],
  },
  'seated-calf-raise': {
    setup: 'Balls of the feet on the platform, pad snug over the knees.',
    steps: ['Let the heels drop for a stretch.', 'Press up onto the toes, pause, lower slowly.'],
    cues: ['Bent knees shift the work to the soleus, which is why it pairs with the standing version.'],
  },

  // ---------------------------------------------------------------- core
  plank: {
    setup: 'Forearms under the shoulders, legs extended, feet hip width.',
    steps: [
      'Squeeze the glutes and brace the abs so the body forms one straight line.',
      'Hold, breathing normally, for the target time.',
    ],
    cues: [
      'Hips sagging or piking both mean the set is over.',
      'Tuck the pelvis slightly rather than arching the lower back.',
    ],
  },
  'hanging-leg-raise': {
    setup: 'Hang from a bar, shoulders active, legs together.',
    steps: [
      'Without swinging, raise the legs until they are at least parallel to the floor.',
      'Curl the pelvis up slightly at the top.',
      'Lower under control.',
    ],
    cues: ['If you swing, do knee raises until you can do it strictly.'],
  },
  'cable-crunch': {
    setup: 'Kneeling under a high pulley, rope beside the head, hips fixed.',
    steps: [
      'Crunch by flexing the spine and bringing the elbows toward the thighs.',
      'Return under control without letting the hips hinge.',
    ],
    cues: ['This is spinal flexion, not a hip hinge — the hips stay still.'],
  },
};
