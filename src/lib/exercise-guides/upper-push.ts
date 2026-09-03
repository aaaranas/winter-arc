import type { ExerciseGuide } from './types';

/** Chest, shoulder and triceps work not already covered by the routine lifts. */
export const UPPER_PUSH_GUIDES: Record<string, ExerciseGuide> = {
  // ------------------------------------------------------------------ chest
  'dumbbell-bench-press': {
    setup:
      'Sit on a flat bench with the dumbbells on your thighs, then kick them up as you lie back. Feet flat, shoulder blades pulled together.',
    steps: [
      'Start with the dumbbells at the outside of the chest, palms forward.',
      'Press up and slightly inward until the arms are nearly locked.',
      'Lower under control until you feel a stretch across the chest.',
    ],
    cues: ['Dumbbells allow a deeper stretch than a bar — use it, but stop short of shoulder pain.'],
  },
  'decline-bench-press': {
    setup: 'Bench set to a slight decline, feet hooked, shoulder blades retracted.',
    steps: [
      'Unrack and bring the bar over the lower chest.',
      'Lower to the lower chest, elbows tucked to about 45°.',
      'Press back up to lockout.',
    ],
    cues: ['Decline shortens the range and takes the shoulders out of it — often the most comfortable press.'],
  },
  'machine-chest-press': {
    setup: 'Seat height so the handles sit level with the mid chest. Back flat against the pad.',
    steps: [
      'Press the handles forward until the arms are nearly straight.',
      'Return under control until you feel a stretch, without letting the weight stack rest.',
    ],
    cues: ['If the handles sit above your shoulders, drop the seat — otherwise it becomes a shoulder press.'],
  },
  'smith-machine-bench-press': {
    setup: 'Bench positioned so the fixed bar path lands on your lower chest. Blades retracted.',
    steps: [
      'Rotate the bar to unhook it and lower to the lower chest.',
      'Press back up and re-hook at the end of the set.',
    ],
    cues: ['The bar path is fixed, so position the bench first — you cannot adjust mid-set.'],
  },
  'decline-dumbbell-press': {
    setup: 'Decline bench, feet hooked, dumbbells at the outside of the lower chest.',
    steps: ['Press up and slightly inward.', 'Lower under control to a comfortable stretch.'],
    cues: ['Have someone hand you the dumbbells if they are heavy — getting into position is the risky part.'],
  },
  'incline-cable-fly': {
    setup: 'Incline bench between two low pulleys, a handle in each hand, arms out wide with a soft elbow bend.',
    steps: [
      'Bring the hands up and together over the upper chest in an arc.',
      'Squeeze, then open back out under control.',
    ],
    cues: ['The elbow angle stays fixed throughout.'],
  },
  'push-up': {
    setup:
      'Hands slightly wider than the shoulders, body in one straight line from head to heels, core and glutes braced.',
    steps: [
      'Lower the chest toward the floor, elbows at about 45° from the torso.',
      'Stop when the chest is just above the floor.',
      'Press back up without letting the hips sag or pike.',
    ],
    cues: [
      'Flaring the elbows to 90° is the most common mistake and the hardest on the shoulders.',
      'The body moves as one piece — if the hips arrive first, brace harder.',
    ],
  },
  'weighted-push-up': {
    setup: 'A plate or weighted vest across the upper back, otherwise a standard push-up position.',
    steps: ['Lower under control to just above the floor.', 'Press back up, keeping the torso rigid.'],
    cues: ['Have someone place the plate — reaching back for it wrecks the setup.'],
  },
  'incline-push-up': {
    setup: 'Hands on a bench or bar, feet on the floor, body in one line.',
    steps: ['Lower the chest to the surface.', 'Press back up.'],
    cues: ['The higher the hands, the easier — a good way to build to floor push-ups.'],
  },
  'knee-push-up': {
    setup: 'Knees on the floor, ankles crossed, body straight from head to knees.',
    steps: ['Lower the chest toward the floor.', 'Press back up.'],
    cues: ['Keep the hips forward — sitting back onto the heels removes the work.'],
  },
  'wide-push-up': {
    setup: 'Hands noticeably wider than the shoulders, body straight.',
    steps: ['Lower under control.', 'Press back up.'],
    cues: ['More chest, less triceps. Do not go so wide that the shoulders complain.'],
  },
  'decline-push-up': {
    setup: 'Feet elevated on a bench or box, hands on the floor, body straight.',
    steps: ['Lower the chest toward the floor.', 'Press back up.'],
    cues: ['The higher the feet, the more it shifts toward the upper chest and shoulders.'],
  },
  'archer-push-up': {
    setup: 'A wide push-up position with the hands turned slightly out.',
    steps: [
      'Lower toward one hand, letting the opposite arm straighten out to the side.',
      'Press back to centre, then repeat to the other side.',
    ],
    cues: ['A step toward the one-arm push-up. The straight arm assists, so it does not have to be dead weight.'],
  },
  'typewriter-push-up': {
    setup: 'Wide push-up position, chest lowered toward one hand.',
    steps: [
      'From the bottom over one hand, travel sideways along the floor to the other hand.',
      'Press up from that side.',
    ],
    cues: ['Stay low through the whole traverse — that time under tension is the point.'],
  },
  'explosive-push-up': {
    setup: 'Standard push-up position, braced.',
    steps: [
      'Lower under control.',
      'Drive up hard enough that the hands leave the floor.',
      'Land with soft elbows and absorb into the next rep.',
    ],
    cues: ['Stop the set when you stop leaving the floor — grinding reps defeats the purpose.'],
  },
  'hindu-push-up': {
    setup: 'Feet wide, hips high, hands on the floor — a downward-dog position.',
    steps: [
      'Dive the chest down and forward, close to the floor.',
      'Sweep through until the hips are low and the chest is up.',
      'Reverse back to the start, or push straight back to the hips-high position.',
    ],
    cues: ['One continuous sweep — it is a movement pattern, not a rep count.'],
  },
  'wall-push-up': {
    setup: 'Standing arm-length from a wall, hands on the wall at chest height.',
    steps: ['Lower the chest toward the wall.', 'Press back to standing.'],
    cues: ['The easiest push-up regression. Step further back to make it harder.'],
  },
  'seal-jack': {
    setup: 'Standing, arms out to the sides at shoulder height.',
    steps: [
      'Jump the feet out while clapping the hands together in front of the chest.',
      'Jump back and open the arms wide.',
    ],
    cues: ['A warm-up movement — keep it light and rhythmic.'],
  },
  'doorway-chest-stretch': {
    setup: 'Forearm on a doorframe, elbow at about shoulder height.',
    steps: [
      'Step forward gently until you feel a stretch across the front of the chest.',
      'Hold, breathing normally, then swap sides.',
    ],
    cues: ['Gentle. If it pinches the front of the shoulder, lower the elbow.'],
  },

  // -------------------------------------------------------------- shoulders
  'standing-dumbbell-press': {
    setup: 'Dumbbells at shoulder height, palms forward, feet hip width, core and glutes braced.',
    steps: ['Press overhead until the arms are nearly locked.', 'Lower under control to shoulder height.'],
    cues: ['Squeeze the glutes so the lower back does not arch to help.'],
  },
  'machine-shoulder-press': {
    setup: 'Seat set so the handles start at shoulder height, back against the pad.',
    steps: ['Press up until nearly locked.', 'Lower to shoulder level under control.'],
  },
  'push-press': {
    setup: 'Bar on the front rack, feet hip width, core braced.',
    steps: [
      'Dip at the knees a few inches, keeping the torso upright.',
      'Drive up explosively through the legs and let that momentum start the bar.',
      'Finish the press with the arms and lock out overhead.',
    ],
    cues: ['A shallow, fast dip. A deep slow dip is a squat, and the bar comes off your chest.'],
  },
  'landmine-press': {
    setup: 'One end of a barbell in a landmine or corner, the other end held at shoulder height.',
    steps: ['Press up and forward along the bar path.', 'Return under control.'],
    cues: ['The angled path is friendly to shoulders that dislike strict vertical pressing.'],
  },
  'front-raise': {
    setup: 'Dumbbells in front of the thighs, palms facing you, elbows slightly bent.',
    steps: ['Raise the arms forward to shoulder height.', 'Lower slowly.'],
    cues: ['Stop at shoulder height. Swinging the weight up means going lighter.'],
  },
  'cable-front-raise': {
    setup: 'Low pulley behind you, handle in front of the thigh.',
    steps: ['Raise the arm forward to shoulder height.', 'Lower against the cable tension.'],
  },
  'plate-front-raise': {
    setup: 'A weight plate held at the edges in front of the thighs.',
    steps: ['Raise the plate to shoulder height.', 'Lower under control.'],
  },
  'machine-lateral-raise': {
    setup: 'Seated with the pads against the outside of the upper arms.',
    steps: ['Raise the arms out to the sides to shoulder height.', 'Lower slowly.'],
    cues: ['The machine removes the swing, so there is no excuse for momentum here.'],
  },
  'upright-row': {
    setup: 'Bar held in front of the thighs, hands about shoulder width — not narrow.',
    steps: ['Pull the bar up the front of the body, leading with the elbows.', 'Stop at chest height, then lower.'],
    cues: [
      'A narrow grip and pulling to the chin is what makes this uncomfortable. Wider grip, lower finish.',
      'Skip it entirely if it pinches the shoulder.',
    ],
  },
  'pike-push-up': {
    setup: 'Hands and feet on the floor with the hips high, forming an inverted V.',
    steps: [
      'Lower the top of the head toward the floor between the hands.',
      'Press back up to the start.',
    ],
    cues: ['The more vertical the torso, the more it becomes a shoulder press.'],
  },
  'feet-elevated-pike-push-up': {
    setup: 'As a pike push-up, with the feet on a bench or box so the torso is more vertical.',
    steps: ['Lower the head toward the floor.', 'Press back up.'],
    cues: ['A step toward the handstand push-up.'],
  },
  'wall-walk': {
    setup: 'Lying face down with the feet against a wall.',
    steps: [
      'Press up and walk the feet up the wall while walking the hands in toward it.',
      'Go as close to the wall as you can control, then walk back down.',
    ],
    cues: ['Come down under control — that is where people fall.'],
  },
  'wall-handstand-push-up': {
    setup: 'Kicked up into a handstand with the heels resting on a wall for balance.',
    steps: ['Lower under control until the head lightly touches the floor.', 'Press back up to lockout.'],
    cues: ['Put a pad under your head. Build up with pike push-ups first.'],
  },
  'handstand-push-up': {
    setup: 'A free-standing handstand, body stacked and braced.',
    steps: ['Lower until the head is just above the floor.', 'Press back to lockout.'],
    cues: ['Only attempt once a free-standing handstand is comfortable on its own.'],
  },
  'arm-circles': {
    setup: 'Standing, arms out to the sides at shoulder height.',
    steps: ['Draw small circles forward, growing gradually larger.', 'Reverse the direction.'],
    cues: ['A warm-up, not a shoulder workout.'],
  },
  'cross-body-shoulder-stretch': {
    setup: 'Standing or seated, one arm straight across the chest.',
    steps: ['Use the other arm to draw it closer until you feel a stretch at the back of the shoulder.', 'Hold, then swap.'],
  },
  'battle-ropes': {
    setup: 'A rope end in each hand, feet shoulder width, knees soft, hips hinged slightly back.',
    steps: [
      'Drive the arms up and down rapidly to send alternating waves down the rope.',
      'Keep going for the target time.',
    ],
    cues: ['Stay braced. The power comes from the whole body, not just the arms.'],
  },

  // ---------------------------------------------------------------- triceps
  dip: {
    setup: 'Supported on parallel bars, arms locked, torso upright, shoulders down.',
    steps: [
      'Lower with the torso vertical until the upper arms are about parallel to the floor.',
      'Press back up to lockout.',
    ],
    cues: ['Upright targets the triceps; leaning forward shifts it to the chest.', 'Do not drop below a comfortable shoulder stretch.'],
  },
  'assisted-dip': {
    setup: 'Knees on the assist pad of the machine, hands on the bars, arms locked.',
    steps: ['Lower until the upper arms are parallel to the floor.', 'Press back up.'],
    cues: ['More weight on the stack means more help — reduce it as you get stronger.'],
  },
  'weighted-dip': {
    setup: 'A dip belt or a dumbbell between the feet, supported on the bars.',
    steps: ['Lower under control.', 'Press back to lockout.'],
    cues: ['Add weight only when clean bodyweight dips are easy for the target reps.'],
  },
  'dumbbell-skull-crusher': {
    setup: 'Lying on a bench, a dumbbell in each hand pressed over the chest, palms facing each other.',
    steps: [
      'Bend at the elbows to lower the dumbbells beside the head.',
      'Extend back up without letting the upper arms drift.',
    ],
    cues: ['Neutral grip is usually kinder to the elbows than a bar.'],
  },
  'single-dumbbell-skullcrusher': {
    setup: 'Lying on a bench, both hands cupping one dumbbell, arms extended over the chest.',
    steps: ['Lower the dumbbell behind the head by bending the elbows.', 'Extend back to the start.'],
    cues: ['Lowering behind the head, not to the forehead, keeps tension through the top.'],
  },
  'dumbbell-overhead-tricep-extension': {
    setup: 'Seated or standing, both hands cupping one dumbbell held overhead.',
    steps: ['Lower the dumbbell behind the head until you feel a stretch.', 'Extend back overhead.'],
    cues: ['Elbows stay pointing forward and close together.'],
  },
  'single-arm-dumbbell-tricep-extension': {
    setup: 'One dumbbell held overhead in one hand, elbow beside the ear.',
    steps: ['Lower behind the head under control.', 'Extend back to lockout, then swap arms.'],
    cues: ['Use the free hand to brace the working elbow if it wanders.'],
  },
  'bench-dip': {
    setup: 'Hands on the edge of a bench behind you, legs out in front, hips just off the bench.',
    steps: ['Lower the hips by bending the elbows.', 'Press back up.'],
    cues: ['Stop if the front of the shoulder complains — this position is demanding on it.'],
  },
  'chair-dip': {
    setup: 'Hands on the front edge of a sturdy chair, hips off the seat, feet forward.',
    steps: ['Lower the hips by bending the elbows.', 'Press back up.'],
    cues: ['Check the chair will not slide before you trust it.'],
  },
  'tricep-kickback': {
    setup: 'Hinged forward with the upper arm parallel to the torso, elbow bent to 90°.',
    steps: ['Extend the forearm back until the arm is straight.', 'Squeeze, then return under control.'],
    cues: ['The upper arm does not move — only the forearm.'],
  },
  'diamond-push-up': {
    setup: 'A push-up position with the hands together under the chest, thumbs and index fingers touching.',
    steps: ['Lower the chest to the hands, elbows tucked close.', 'Press back up.'],
    cues: ['Elbows brush the ribs. Flaring turns it back into a chest exercise.'],
  },
  'crab-walk': {
    setup: 'Seated with the hands behind you and feet flat, hips lifted off the floor.',
    steps: ['Walk forward or backward on the hands and feet, keeping the hips up.'],
    cues: ['Do not let the hips drop — holding them up is most of the work.'],
  },
};
