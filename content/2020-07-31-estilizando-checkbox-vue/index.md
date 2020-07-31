---
title: Como hacer un switch input con Vue.js.
date: 2020-07-31
tags: [vuejs, javascript, sass]
path: blog/estilizando-checkbox-vue
cover: ./preview.png
excerpt: Vue Tips
---

Hola 👋! Parece que me perdido un poco por aquí.

Hoy les voy a enseñar a estilizar un checkbox con Vue.js, para que lo puedan utilizar en cualquiera de sus proyectos.

Antes de comenzar, para el diseño me he basado en algunas (no todas) las directrices de este UI Kit: [Now UI](https://www.invisionapp.com/inside-design/design-resources/now/)

> Ahora si, vamos a ver como hacerlo !

### Que es Vue.js?

Vue.js es un marco JavaScript de código abierto modelo-vista-vista-modelo para construir interfaces de usuario y aplicaciones de una sola página. Fue creado por Evan You, y lo mantienen él y el resto de los miembros activos del equipo central provenientes de varias compañías como Netlify y Netguru.

### Diseñando el template !

Si has usado Angular, Vue se te hará muy familiar, ya que ambos utilizan un sistema de templates que separan la vista de la lógica.

Lo primero que haremos será envolver la etiqueta `<input />` dentro de una etiqueta `<label>`, le asignamos `role=button` para que actue como un botón, esto se denomina [control etiquetado](https://developer.mozilla.org/es/docs/Web/HTML/Elemento/label).

```html
<template>
  <label role="button">
    <input type="checkbox" />
  </label>
</template>
```

Además crearemos un div que nos va otorgar un efecto de Switch, le colocaremos como hija una etiqueta que nos muestre el estado del checkbox; utilizaremos `<span>`.

```html
<template>
  <label role="button">
    <input type="checkbox" />
    <div>
        <span>on|off</span>
    </div>
  </label>
</template>
```

Para terminar, necesitamos agregar las clases css (ya las vamos crear), el `v-model` para [crear el binding bidireccional](https://es.vuejs.org/v2/guide/forms.html), una función `v-on:change | @change` que nos provee Vue, y una variable `label` donde mostraremos el estado del switch.

> Fijense que en el `div`, además de la propiedad `class` he usado `:class` para intercambiar entre los estilos  on y off.

Ya tenemos nuestro template terminado 🎉 !

```html
<template>
  <label class="switch" role="button">
    <input
      type="checkbox"
      :value="active"
      v-model="checked"
      @change="update"
    />
    <div
      class="circle"
      :class="{
        'circle-on': checked,
        'circle-off': !checked
      }"
    >
      <span>{{ label }}</span>
    </div>
  </label>
</template>
```

### Codificando el script !

Ya tenemos el template terminado, pero por si solo no va a hacer nada. Ahora es el momento de darle la funcionalidad ⚙.

> Lo que más me gusta de Vue, es que tienes un solo objeto con la funcionalidad separada, esto nos permite entender facilmente como esta construido el componente.

Empecemos declarando las variables que vamos a necesitar para hacer funcionar nuestro componente.

```javascript
<script>
export default {
  data() {
    return {
      checked: true,
      label: "On",
      active: 1,
      dataOn: "On",
      dataOff: "Off"
    };
  },
</script>
```

> 👁‍🗨 Si queremos que nuestro componente sea más personalizable con el texto en `label`, y el `value` necesitamos convertir `dataOn`, `dataOff` y `active` en propiedades.

```javascript
<script>
export default {
  props: {
      dataOn: String,
      dataOff: String
      active: Number,
  }
  data() {
    return {
      checked: true,
      label: "On",
    };
  },
</script>
```

Cada vez que nuestro componente se inicialice, utilizaremos el hook  `created`. Esto pertenece al [ciclo de vida del componente Vue](https://es.vuejs.org/v2/guide/instance.html#Diagrama-del-Ciclo-de-vida). En el hook vamos inicializar las variables `checked` y `label`. 

> 👁‍🗨 Para acceder a las variables de data, props y funciones necesitamos la palabra reservada `this`.

```javascript
<script>
export default {
  data() {
    ...
  },
  mounted() {
    this.checked = Boolean(this.active);
    this.label = this.checked ? this.dataOn : this.dataOff;
  },
};
</script>
```

Antes, en el template habíamos definido una función `update`, ahora es el momento de crearla. Todas la funciones se declaran dentro de la opción `methods` de Vue. La función `update` simplemente se va a encargar de actualizar la variable `label` cuando cambie el valor de `checked`.

```javascript
<script>
export default {
  data() {
    ...
  },
  mounted() {
    ...
  },
  methods: {
    update() {
      this.label = this.checked ? this.dataOn : this.dataOff;
    }
  }
};
</script>
```

Ya tenemos la lógica del switch 🎊!

Si te perdiste, así tenemos la parte JavaScript.

```javascript
<script>
export default {
  data() {
    return {
      checked: true,
      label: "",
      active: 1,
      dataOn: "On",
      dataOff: 'Off'
    };
  },
  mounted() {
    this.checked = Boolean(this.active);
    // Podemos reutilizar la función update ya que el código es el mismo.
    this.update();
  },
  methods: {
    update() {
      this.label = this.checked ? this.dataOn : this.dataOff;
    }
  }
};
</script>
```

### Agregando estilos con Sass !

Esta es la parte final, aunque tengamos el template y la funcionalidad, tenemos que hacer que se vea elegante. En lo personal me gusta <span style="color:#CF649A">Sass</span>, pero puedes utilizar <span style="color:#333333">Stylus</span>, <span style="color:#1E416F">Less</span> o simplemente css.

Primero, vamos a definir un par de variables 🟩 (que luego podrás personalizar).

```sass
<style lang="scss">
$default: black;
$active: #f96332;
$inactive: #6c757d;
$text: #9d9d9d;
$text-hover: white;
$size: 2.5rem; // font-size
$w: 300px; // largo del elemento
$h: 100px; // alto del elemento
$circle: $h - 4; // tamaño del div
$toggle-dis: $w - $circle - 2; // la distancia que va a recorrer el div para lograr el efecto de switch
</style>
```

Vamos a deshacernos del `input` que viene por defecto. Hay que tomar en cuenta que debemos aplicar esta regla para el elemento dentro de la clase `switch`.

```sass
<style lang="scss">
...

.switch {
    & input {
        display: none;
    }
}
</style>
```

Ahora ya somos libres de aplicar los estilos. Les colocaré todo el código css para no abrumarlos 👾.

```sass
<style lang="scss">
$default: black;
$active: #f96332;
$inactive: #6c757d;
$text: #9d9d9d;
$text-hover: white;
$size: 2.5rem;
$w: 300px;
$h: 100px;
$circle: $h - 4;
$toggle-dis: $w - $circle - 2;

.switch {
    position: relative;
    display: inline-block;
    width: $w;
    height: $h;
    border-radius: 100px;

    .circle {
        display: flex;
        align-items: center;
        width: 100%;
        height: $h - 2;
        border-radius: 100px;
        background-color: $default;

        & > span {
            font-size: $size;
            color: $text;
            padding-left: $h + 4;
        }

        &::before {
            position: absolute;
            content: "";
            height: $circle;
            width: $circle;
            left: 1px;
            top: 1px;
            border-radius: 100px;
            background-color: white;
            -webkit-transition: 0.4s;
            transition: 0.4s;
        }

        &:hover {
            background-color: lighten($default, 20);

            & > span {
                color: $text-hover;
            }
        }
    }

    .circle-on {
        background-color: $active;

        & > span {
            color: white;
        }

        &:hover {
            background-color: white;
            border: 1px $active solid;

            &::before {
                background-color: $active;
            }

            & > span {
                color: $active;
            }
        }
    }

    .circle-off {
        background-color: $inactive;

        & > span {
            color: white;
        }

        &:hover {
            background-color: white;
            border: 1px $inactive solid;

            &::before {
                background-color: $inactive;
            }

            & > span {
                color: $inactive;
            }
        }
    }

    & input {
        display: none;

        &:checked + .circle:before {
            -webkit-transform: translateX($toggle-dis);
            -ms-transform: translateX($toggle-dis);
            transform: translateX($toggle-dis);
        }
    }
}
</style>
```

### Resultado final

Si seguimos todos los pasos, tendremos nuestro switch listo para funcionar 🏁.

<iframe height="265" style="width: 100%;" scrolling="no" title="Switch Input based in Now UI" src="https://codepen.io/jamorocho3/embed/VweOXyx?height=265&theme-id=light&default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/jamorocho3/pen/VweOXyx'>Switch Input based in Now UI</a> by Jerson Morocho
  (<a href='https://codepen.io/jamorocho3'>@jamorocho3</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

<p>
<br />
Este ejemplo lo puedes desarrollar tanto en Angular como en React. La lógica en sí es la misma.
</p>

Proximamente estaré subiendo algo nuevo, espero librarme de la U y traerles más contenido !

Nos vemos codeando 👨‍💻.