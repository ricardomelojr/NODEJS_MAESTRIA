import styles from './Input.module.css';

function Input({
  type,
  text,
  name,
  placeholder,
  handleOnChange,
  value,
  multiple,
}) {
  return (
    <div className={styles.form_control}>
      <label htmlFor={name}>{text}:</label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        onChange={handleOnChange}
        value={value}
        /* multiple: permite a seleção de múltiplos valores, no caso de imagens, permite selecionar várias imagens. */
        {...(multiple ? { multiple } : '')}
      ></input>
    </div>
  );
}

export default Input;
