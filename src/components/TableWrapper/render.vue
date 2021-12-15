<script>
    export default {
        functional: true,
        render(h, context) {
            const {row, field, render, index} = context.props;
            const renderResult = render(h, row[field], row, index);
            // console.log(renderResult, render(row[field], row));
            // return renderResult
            return (renderResult instanceof Array) ? renderResult : [renderResult];
        }
    }
</script>
