

let mod = document.querySelector('a-entity')
mod.addEventListener('model-loaded', (e) => {
  console.log(mod.getAttribute('position'))  
})
