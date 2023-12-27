class GraphComponent extends React.Component {
    constructor(props) {
        super(props);
        // Lógica de clase para almacenar la referencia
        // al DOM real.
        this.nodeRef = null;
        this.setRef = (ref) => {
            this.nodeRef = ref;
        };
    }
    componentDidMount() {
        // LLamada a D3. Patrón enter.
        graphAPI.create_graph(this.nodeRef, this.props.data);
    }
    shouldComponentUpdate(prevProps) {
        // Permitimos renders sólo si los datos
        // han cambiado. Así alcanzaremos el siguiente
        // punto del ciclo de vida.
        //return Boolean(prevProps.data !== this.props.data);
        return prevProps.data !== this.props.data;
    }
    componentDidUpdate() {
        // LLamada a D3. Update().
        graphAPI.update_graph(this.props.data);
    }
    render() {
      return <svg className="graph" ref={this.setRef} />
    };
}