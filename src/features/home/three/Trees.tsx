import { Instance, Instances } from "@react-three/drei"
import { TREES } from "./city"

const ROUND = TREES.filter((tree) => tree.kind === "round")
const PALM = TREES.filter((tree) => tree.kind === "palm")

const CANOPY = ["#2f7d4a", "#357f45", "#276b3f", "#3f9a5f"]

export function Trees() {
  return (
    <group>
      <Instances limit={ROUND.length} frustumCulled={false}>
        <cylinderGeometry args={[0.26, 0.44, 3.2, 7]} />
        <meshStandardMaterial color="#7a5c3a" roughness={0.95} />
        {ROUND.map((tree, index) => (
          <Instance key={index} position={[tree.x, 1.6 * tree.s, tree.z]} scale={tree.s} />
        ))}
      </Instances>

      <Instances limit={ROUND.length} frustumCulled={false}>
        <icosahedronGeometry args={[2, 1]} />
        <meshStandardMaterial roughness={0.9} flatShading />
        {ROUND.map((tree, index) => (
          <Instance
            key={index}
            position={[tree.x, 3.5 * tree.s, tree.z]}
            scale={tree.s}
            color={CANOPY[index % CANOPY.length]}
          />
        ))}
      </Instances>

      <Instances limit={ROUND.length} frustumCulled={false}>
        <icosahedronGeometry args={[1.3, 1]} />
        <meshStandardMaterial roughness={0.9} flatShading />
        {ROUND.map((tree, index) => (
          <Instance
            key={index}
            position={[tree.x + 0.4 * tree.s, 4.8 * tree.s, tree.z - 0.2 * tree.s]}
            scale={tree.s * 0.85}
            color={index % 3 === 0 ? "#43a566" : "#35915a"}
          />
        ))}
      </Instances>

      <Instances limit={PALM.length} frustumCulled={false}>
        <cylinderGeometry args={[0.2, 0.32, 6, 6]} />
        <meshStandardMaterial color="#8a6b45" roughness={0.95} />
        {PALM.map((tree, index) => (
          <Instance key={index} position={[tree.x, 3 * tree.s, tree.z]} scale={tree.s} />
        ))}
      </Instances>

      <Instances limit={PALM.length} frustumCulled={false}>
        <icosahedronGeometry args={[1.4, 0]} />
        <meshStandardMaterial roughness={0.9} flatShading />
        {PALM.map((tree, index) => (
          <Instance
            key={index}
            position={[tree.x, 6.1 * tree.s, tree.z]}
            scale={[tree.s * 1.6, tree.s * 0.5, tree.s * 1.6]}
            color={index % 2 === 0 ? "#2f7d4a" : "#3a8a52"}
          />
        ))}
      </Instances>
    </group>
  )
}
