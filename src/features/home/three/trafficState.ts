export interface VehiclePose {
  x: number
  z: number
  r: number
}

const POSES: VehiclePose[] = []

export function setVehiclePose(index: number, x: number, z: number, r: number) {
  const pose = POSES[index]
  if (pose) {
    pose.x = x
    pose.z = z
    pose.r = r
  } else {
    POSES[index] = { x, z, r }
  }
}

export function hitsVehicle(x: number, z: number, radius: number) {
  for (let i = 0; i < POSES.length; i += 1) {
    const pose = POSES[i]
    const dx = x - pose.x
    const dz = z - pose.z
    const reach = radius + pose.r
    if (dx * dx + dz * dz < reach * reach) return true
  }
  return false
}
