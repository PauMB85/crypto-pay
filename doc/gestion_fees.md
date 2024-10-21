# Estrategias Fees

## Introducción

Separar la responsabilidad del cálculo de las fees del smart contract de procesamiento de pagos (`PaymentProcessor`) para seguir el principio de responsabilidad única (SRP). De este modo, el contrato `PaymentProcessor` no necesitaría saber cómo se calculan las fees, lo que lo hace más flexible y fácil de mantener.

## Estrategias para delegar el cálculo de las fees:

A continuación, se plantean algunas estrategias para delegar el cálculo de las fees, manteniendo los contratos modulares y flexibles:

### 1. **Contratos separados para el cálculo de las fees (FeeManager o FeeCalculator)**

- Crear un contrato específico, como `FeeManager` o `FeeCalculator`, que tenga la lógica de cálculo de las fees. Este contrato calculará las fees con base en las reglas que definas (como por token, por monto, por porcentaje variable, etc.).
- `PaymentProcessor` simplemente hará una llamada a `FeeManager` y obtendrá el valor de la fee calculada, sin conocer la lógica interna.

**Ventajas**:

- Permite cambiar la lógica de las fees sin modificar el contrato `PaymentProcessor`.
- Posibilidad de implementar varias políticas de fees dependiendo de los tokens, usuarios o condiciones.

**Posibles casos**:

- Fees fijas (porcentaje fijo para todos los tokens).
- Fees variables según el tipo de token o monto transferido.
- Recompensas o descuentos en fees para ciertos usuarios o en función de su comportamiento.

### 2. **Política de fees basada en roles o usuarios (Fee Strategy)**

- Implementar diferentes estrategias o "roles" para calcular las fees. Por ejemplo:
  - **Usuarios estándar**: Pagos con una fee regular.
  - **Usuarios premium**: Menor fee o incluso cero fees.
- En esta estrategia, el contrato `FeeCalculator` puede calcular las fees según el rol del usuario o su comportamiento.

**Ventajas**:

- Flexibilidad para implementar distintas tarifas o incluso exenciones de fees para usuarios específicos.
- Fácilmente ampliable para incluir nuevos tipos de usuarios.

**Posibles casos**:

- Los "usuarios estándar" pagan el 1% de fee.
- Los "usuarios premium" tienen un descuento y pagan un 0.5% de fee.
- Pueden aplicarse recompensas a usuarios recurrentes o usuarios que hagan pagos grandes.

### 3. **Uso de un patrón de "estrategia" para cálculo de fees (Strategy Pattern)**

- En esta estrategia, creamos varios contratos que implementen distintas estrategias para calcular las fees, y el contrato `PaymentProcessor` selecciona dinámicamente cuál usar.
- La estrategia concreta de fees puede depender del tipo de transacción, del token, del usuario o de cualquier otro parámetro.

**Ventajas**:

- Extensibilidad: Nuevas estrategias de cálculo de fees pueden ser añadidas sin modificar el contrato principal.
- Modularidad: El cálculo de fees puede cambiar dependiendo de las condiciones de la transacción.

**Posibles casos**:

- **Estrategia 1 (porcentaje fijo)**: Un cálculo simple de fees basado en un porcentaje fijo para todos los tokens.
- **Estrategia 2 (por monto)**: Una fee que varía según la cantidad transferida.
- **Estrategia 3 (basada en demanda)**: Una fee que varía dependiendo del número de transacciones en un periodo (alta demanda, fees más altas).

### 4. **Uso de contratos modulares o de plugins (Pluggable Fees)**

- Este enfoque permite tener un sistema de "plugins" donde diferentes módulos o contratos pueden ser "enchufados" para calcular las fees. Dependiendo del contexto, puedes seleccionar el módulo de cálculo de fees que se utilizará.
- Se puede utilizar un patrón de fábrica o de selección que permita elegir el plugin adecuado para el cálculo de fees.

**Ventajas**:

- Permite una gran flexibilidad para agregar o eliminar módulos de cálculo de fees sin afectar la lógica principal del contrato.
- Ideal para escenarios donde la política de fees cambia con frecuencia o se basa en condiciones externas.

**Posibles casos**:

- Agregar nuevos módulos de fees sin necesidad de cambiar el contrato base.
- Usar diferentes módulos de cálculo según la red blockchain o tipo de transacción.

### 5. **Contrato de oráculo para obtener las fees de fuentes externas (Oracles)**

- Usar un oráculo externo para determinar las fees dinámicamente según factores externos (como el estado de la red, la volatilidad del token, o incluso datos fuera de la blockchain).
- El oráculo calcularía la fee y `PaymentProcessor` recibiría este valor como referencia.

**Ventajas**:

- Permite determinar las fees de manera dinámica basándose en factores externos.
- Flexibilidad para adaptarse a condiciones cambiantes de la red o del mercado de tokens.

**Posibles casos**:

- Las fees se calculan según el estado actual del mercado del token.
- Se ajustan las fees de manera dinámica basadas en la congestión de la red o la volatilidad de los precios.

### 6. **Patrón de middleware para el cálculo de fees**

- Implementar un sistema donde `PaymentProcessor` no interactúa directamente con `FeeCalculator`, sino que un middleware gestiona el cálculo de las fees antes de procesar el pago.
- El middleware puede manejar diferentes políticas de fees y seleccionar cuál aplicar según el contexto.

**Ventajas**:

- Abstracción total de la lógica de fees, permitiendo cambiarla sin tocar `PaymentProcessor`.
- Mejor escalabilidad al delegar responsabilidades a módulos intermedios.

**Posibles casos**:

- Middleware que selecciona la estrategia de fees dependiendo del token.
- Middleware que evalúa el comportamiento del usuario para aplicar una política de descuento.

## Comparativa de estrategias:

| Estrategia               | Flexibilidad | Complejidad | Escalabilidad |
| ------------------------ | ------------ | ----------- | ------------- |
| Contrato de `FeeManager` | Media        | Baja        | Alta          |
| Política basada en roles | Alta         | Media       | Media         |
| Patrón de estrategia     | Muy alta     | Media       | Muy alta      |
| Plugins/modular          | Muy alta     | Alta        | Muy alta      |
| Oráculos                 | Alta         | Alta        | Media         |
| Middleware               | Alta         | Alta        | Muy alta      |

## Conclusión:

El enfoque dependerá de la flexibilidad que desees en tu sistema de fees:

- Si quieres algo sencillo y fácilmente modificable, un contrato `FeeManager` básico podría ser suficiente.
- Si deseas tener varias políticas de fees o un sistema más dinámico, el patrón de estrategia o middleware sería más adecuado.
- Para condiciones externas, los oráculos podrían ofrecer mayor flexibilidad.

¿Cuál de estas estrategias te parece más adecuada para implementar?
