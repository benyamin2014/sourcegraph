// Package conf provides functions for accessing the Site Configuration.
package conf

import (
	"log"
	"os"
	"path/filepath"

	"github.com/sourcegraph/jsonx"
	"github.com/sourcegraph/sourcegraph/pkg/conf/conftypes"
	"github.com/sourcegraph/sourcegraph/schema"
)

// UnifiedConfiguration represents the overall Sourcegraph configuration from
// various sources:
//
// - The core configuration, from the database (from the management console).
// - The site configuration, from the database (from the site-admin panel).
// - Deployment configuration, from the frontend (e.g. which gitservers to talk to).
//
type UnifiedConfiguration struct {
	schema.SiteConfiguration
	Core       schema.CoreSiteConfiguration
	Deployment conftypes.DeploymentConfiguration
}

type configurationMode int

const (
	// The user of pkg/conf reads and writes to the configuration file.
	// This should only ever be used by frontend.
	modeServer configurationMode = iota

	// The user of pkg/conf only reads the configuration file.
	modeClient

	// The user of pkg/conf is a test case.
	modeTest
)

func getMode() configurationMode {
	mode := os.Getenv("CONFIGURATION_MODE")

	switch mode {
	case "server":
		return modeServer
	case "client":
		return modeClient
	default:
		// Detect 'go test' and default to test mode in that case.
		p, err := os.Executable()
		if err == nil && filepath.Ext(p) == ".test" {
			return modeTest
		}

		// Otherwise we default to client mode, so that most services need not
		// specify CONFIGURATION_MODE=client explicitly.
		return modeClient
	}
}

var (
	configurationServerFrontendOnly            *Server
	configurationServerFrontendOnlyInitialized = make(chan struct{})
)

func init() {
	clientStore := NewStore()
	defaultClient = &client{store: clientStore}

	mode := getMode()

	// Don't kickoff the background updaters for the client/server
	// when running test cases.
	if mode == modeTest {
		close(configurationServerFrontendOnlyInitialized)

		// TODO(slimsag): UnifiedConfiguration

		// Seed the client store with a dummy configuration for test cases.
		dummyConfig := `
		{
			// This is an empty configuration to run test cases.
		}`

		_, err := clientStore.MaybeUpdate(conftypes.RawUnifiedConfiguration{
			Core:       "{}",
			Site:       "{}",
			Deployment: conftypes.DeploymentConfiguration{},
		})
		if err != nil {
			log.Fatalf("received error when setting up the store for the default client during test, err :%s", err)
		}

		return
	}

	// The default client is started in InitConfigurationServerFrontendOnly in
	// the case of server mode.
	if mode == modeClient {
		close(configurationServerFrontendOnlyInitialized)

		go defaultClient.continuouslyUpdate()
	}
}

// InitConfigurationServerFrontendOnly creates and returns a configuration
// server. This should only be invoked by the frontend, or else a panic will
// occur. This function should only ever be called once.
func InitConfigurationServerFrontendOnly(source ConfigurationSource) *Server {
	mode := getMode()

	if mode == modeTest {
		return nil
	}

	if mode == modeClient {
		panic("cannot call this function while in client mode")
	}

	server := NewServer(source)
	server.Start()

	close(configurationServerFrontendOnlyInitialized)

	go defaultClient.continuouslyUpdate()
	configurationServerFrontendOnly = server
	return server
}

// FormatOptions is the default format options that should be used for jsonx
// edit computation.
var FormatOptions = jsonx.FormatOptions{InsertSpaces: true, TabSize: 2, EOL: "\n"}
