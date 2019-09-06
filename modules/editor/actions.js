export default function (target) {
  return {
    actors: {
      rotate: {
        label: 'Girar',
        callback: () => {
          console.log(target)
          target.angle += 90
        }
      }
    }
  }
}
