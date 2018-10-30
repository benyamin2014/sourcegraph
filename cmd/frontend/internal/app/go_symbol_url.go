package app

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/sourcegraph/sourcegraph/cmd/frontend/backend"
	"github.com/sourcegraph/sourcegraph/pkg/api"
	"github.com/sourcegraph/sourcegraph/pkg/errcode"
	"github.com/sourcegraph/sourcegraph/pkg/gosrc"
	"github.com/sourcegraph/sourcegraph/pkg/httputil"
)

// serveGoSymbolURL handles Go symbol URLs (e.g.,
// https://sourcegraph.com/go/github.com/gorilla/mux/-/Vars) by
// redirecting them to the file and line/column URL of the definition.
func serveGoSymbolURL(w http.ResponseWriter, r *http.Request) error {
	ctx := r.Context()

	parts := strings.Split(strings.TrimPrefix(r.URL.Path, "/"), "/")
	if len(parts) < 2 {
		return fmt.Errorf("invalid symbol URL path: %q", r.URL.Path)
	}
	mode := parts[0]
	symbolID := strings.Join(parts[1:], "/")

	if mode != "go" {
		return &errcode.HTTPErr{
			Status: http.StatusNotFound,
			Err:    errors.New("invalid mode (only \"go\" is supported"),
		}
	}

	importPath := strings.Split(symbolID, "/-/")[0]
	dir, err := gosrc.ResolveImportPath(httputil.CachingClient, importPath)
	if err != nil {
		return err
	}
	cloneURL := dir.CloneURL

	if cloneURL == "" || !strings.HasPrefix(cloneURL, "https://github.com") {
		return fmt.Errorf("non-github clone URL resolved for import path %s", importPath)
	}

	repoName := api.RepoName(strings.TrimSuffix(strings.TrimPrefix(cloneURL, "https://"), ".git"))
	repo, err := backend.Repos.GetByName(ctx, repoName)
	if err != nil {
		return err
	}

	commitID, err := backend.Repos.ResolveRev(ctx, repo, "")
	if err != nil {
		return err
	}
	_ = commitID

	// TODO!(sqs): implement this
	panic("TODO!(sqs)")
	// symbols, err := backend.Symbols.List(r.Context(), repo.Name, commitID, mode, lspext.WorkspaceSymbolParams{
	// 	Symbol: lspext.SymbolDescriptor{"id": symbolID},
	// })
	// if err != nil {
	// 	return err
	// }

	// if len(symbols) > 0 {
	// 	symbol := symbols[0]
	// 	uri, err := gituri.Parse(string(symbol.Location.URI))
	// 	if err != nil {
	// 		return err
	// 	}
	// 	filePath := uri.Fragment
	// 	dest := &url.URL{
	// 		Path:     "/" + path.Join(string(repo.Name), "-/blob", filePath),
	// 		Fragment: fmt.Sprintf("L%d:%d$references", symbol.Location.Range.Start.Line+1, symbol.Location.Range.Start.Character+1),
	// 	}
	// 	http.Redirect(w, r, dest.String(), http.StatusFound)
	// 	return nil
	// }

	// return &errcode.HTTPErr{
	// 	Status: http.StatusNotFound,
	// 	Err:    errors.New("symbol not found"),
	// }
}
